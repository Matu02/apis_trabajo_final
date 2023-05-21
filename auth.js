import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import users from './users.js';

class AuthorizationGoogle {
    constructor(app) {
        const GOOGLE_CLIENT_ID = "782947744959-m58n1q0403ampr46n00jtqer4ju28h6e.apps.googleusercontent.com";
        const GOOGLE_CLIENT_SECRET = "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";

        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());

        passport.use(new GoogleStrategy({
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

    checkAuthenticated(req, res, next) {//Permite verificar que un endpoint este validado. Para validar users xej
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }

}
//////////TERMINA AUTHORIZATION GOOGLE////////

//////////EMPIEZA AUTHORIZATION LOCAL/////////
class AuthorizationLocal{
    constructor(app) {
        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());
        passport.use(new LocalStrategy(this._verify));

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }

    _verify(username, password, done) {

        // Find the user by username.
        if (!users.has(username)) {
            // If the user was not found, return an error.
            return done(new Error('Invalid username or password'));
        }

        const user = users.get(username);
        // Compare the password entered by the user with the password stored in the database.
        if (user.password !== password) {
            return done(new Error('Invalid username or password'));
        }

        // The user is authenticated, so return them.
        console.log("Login OK");
        return done(null, user);
    }

    checkAuthenticated(req, res, next) {//ve si esta utenticado sino al login
        if (req.isAuthenticated()) { 
            return next(); 
        }
        res.redirect("/login");
    }

}
export {AuthorizationGoogle, AuthorizationLocal};