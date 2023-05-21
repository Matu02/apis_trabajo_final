import express from 'express';
import passport from 'passport';
import db from './db.js';
import path from 'path';
import fs from 'fs';
import {AuthorizationGoogle, AuthorizationLocal} from './auth.js';

const __dirname = fs.realpathSync('.');

class AgendaBackendServer {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public')); //Le digo a express que busque las cosas directamente en la carpeta public
    app.use(express.urlencoded({ extended: false }));
    app.get('/lookup/:destination', this._doLookup); //Cuando alguien busca un destino, se ejecuta la funcion _doLookup

    this._authGoogle = new AuthorizationGoogle(app);
    this._authLocal = new AuthorizationLocal(app);
    
    app.get('/login/', this._login);//Este es para local y para google

////////////////////////////////////LOCAL///////////////////////////////////////////

    app.get('/', this._authLocal.checkAuthenticated, this._goHome); //authorization._verify funcion intermedia entre traer / ¿? y ejecutar la funcion goHome
    app.post(`/login/`, passport.authenticate(`local`, {failureRedirect: `/login`}))//Hago que passport autentique sino vuelve a login. Funcion intermedia autentificacion, quiero que autentique al usuario

////////////////////////////////////GOOGLE///////////////////////////////////////////
    app.get('/auth/google/',
      passport.authenticate('google', {
        scope: ['email', 'profile']//esto es lo que le pido a google
      }));
    app.get('/auth/google/callback', passport.authenticate('google', { //Recibe la autentificación que hace google
      successRedirect: '/', //Si la autentificación es correcta, te manda al home
      failureRedirect: '/login' //Si la autentificación es incorrecta, te manda de nuevo al login
    }));
    app.get('/', this._authGoogle.checkAuthenticated, this._goHome);

    app.post("/logout", (req, res) => {
      req.logOut(err => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/login");
    });     


    // Start server
    app.listen(3000, () => console.log('Listening on port 3000'));    
  }

  async _login(req, res) {
    res.sendFile(path.join(__dirname, "public/login/login.html"));
  }

  async _goHome(req, res) {
    res.sendFile(path.join(__dirname, "public/home.html"));
  }

  async _doLookup(req, res) {
    const routeParams = req.params;
    const destination = routeParams.destination; //Guarda el destino solicitado x el usuario (CHEQUEAR SI ES routeParams.destination)
    const query = { name: destination.toLowerCase() }; //Prepara la palabra para poder ser enviada en la query a la db. Pongo name: xq en la base de datos se llama así el lugar donde está el nombre del lugar
    const collection = db.collection("datosDestinos"); //Pide a la db que traiga la collection llamada "datosDestinos"
    const storedDestination = await collection.findOne(query); //Busca en la colección una palabra que sea la palabra ingresada por el usuario, q esta guardada en la variable query
    const response = { //Respuesta que vuelve al frontend
      destination: storedDestination.name, //Le mando la palabra de nuevo
      hotel: storedDestination.hotels,
      activities: storedDestination.activities
    };
    res.json(response);
  }

  // async _doUserLookup(req, res){
  //   const routeParams = req.params;
  //   const user = routeParams.username; 
  //   const query = { username: user.toLowerCase() }; 
  //   const usersCollection = db.collection("users"); 
  //   const storedUser = await usersCollection.findOne(query);
  //   const response = { //Respuesta que vuelve al frontend
  //     username: storedUser.username, 
  //     password: storedUser.password
  //   };
  //   res.json(response);
  // }

}

new AgendaBackendServer();