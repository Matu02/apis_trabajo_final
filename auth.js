import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import db from './db.js';

class AuthorizationGoogle { //En esta clase ira todo lo relaciona a la autenticación usando Google
    constructor(app) {
        const GOOGLE_CLIENT_ID = "782947744959-m58n1q0403ampr46n00jtqer4ju28h6e.apps.googleusercontent.com";
        const GOOGLE_CLIENT_SECRET = "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"; //Estos son datos para poder usar el login con Google (tenes q registrar como developer en Google)

        //Configuración del middleware de sesión ???
        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // inicializa passport, haciendo q se ejecute en cada solicitud 
        app.use(passport.session()); //Passport usa la session para almacenar el estado de autenticación del usuario

        passport.use(new GoogleStrategy({ //Indico que vpy a usar la estrategia de google
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback: true
        }, this._verify));

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }

    _verify(request, accessToken, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile);
    }

    checkAuthenticated(req, res, next) {//Verifica que el usuario este autenticado, la pongo como funcion intermedia en los endpoints, entonces si el usuario no esta autenticado no podrá acceder a ese endpoint
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }

}

//////////EMPIEZA AUTHORIZATION LOCAL/////////
class AuthorizationLocal{ //En esta clase ira todo lo relaciona a la autenticación usando la estrategia local que se conecta a la base de datos
    constructor(app, db) {
        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));
        this.db = db; //Guardo en la variable this.db la base de datos que importe desde ./db.js

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());
        passport.use(new LocalStrategy(this._verify)); //Indico que usare la estrategia local y que para eso usare la funcion _verify

        passport.serializeUser((user, done) => done(null, user)); //serializa al usuario para que pueda ser guardado en la sesión
        passport.deserializeUser((user, done) => done(null, user)); //Se deserializa el usuario para poder usarlo en solicitudes siguientes
    }

    async _verify(username, password, done) {
        const collection = db.collection("users"); //Guardo la collection users de mi base de datos en la variable collection
        const user = await collection.findOne({ username: username }); //Busco en esa collection un username q coincida con el username ingresado x el usuario. Eso se guarda en la variable user
    
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' }); //Si el nombre de usuario está mal, devuelve este mensaje
        }
    
        if (user.password !== password) {
          return done(null, false, { message: 'Invalid username or password' }); //Si la contraseña está mal, devuelve este mensaje
        }
    
        console.log("Login OK"); //Si todo sale bien, se muestra esto en la terminal
        return done(null, user); //Si la autenticación es correcta, se pasa el objeto user a passport para q lo almacene en sesión
        //La diferencia con los "return done" q se ven en los ifs es que esos ponen false en vez del user, xq ahi hubo un error con el nombre o la contraseña
    }

    checkAuthenticated(req, res, next) {//verifica que el usuario este autenticado para darle acceso a los endpoints donde se llame esta función en el server.js
        if (req.isAuthenticated()) { //req es el objeto q tiene la solicitud hecha x el cliente. isAuthenticated es un metodo de passport q chequea si estas autenticado
            return next(); //Si estas autenticado, te permite el acceso
        }
        res.redirect("/login"); //Si no estas autenticado te manda al login
    }

}
export {AuthorizationGoogle, AuthorizationLocal}; //Exporto las dos estrategias para poder usarlas en el server.js