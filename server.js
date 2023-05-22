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
    

    this._authGoogle = new AuthorizationGoogle(app); //Creo una instancia de la estrategia de seguridad con Google
    this._authLocal = new AuthorizationLocal(app, db); //Lo mismo pero con la estrategia local

    app.get('/login/', this._login);//Este get es para que se muestre el HTML de login
    app.get('/lookup/:destination', this._authLocal.checkAuthenticated, this._doLookup); //Cuando alguien busca un destino, primero se verifica q este autenticado localmente y desp se ejecuta la funcion _doLookup
    app.get('/lookup/:destination', this._authGoogle.checkAuthenticated, this._doLookup); //Lo mismo pero en caso de q haya iniciado sesión con Google

////////////////////////////////////LOCAL///////////////////////////////////////////

    app.get('/', this._authLocal.checkAuthenticated, this._goHome); //Este get es para que se muestre el home. Pero para poder hacerlo, antes chequea que estes autenticado localmente
    app.post(`/login/`, passport.authenticate(`local`, {failureRedirect: `/login`}))//Hago que passport autentique, si no estoy autenticado vuelve a login.

////////////////////////////////////GOOGLE///////////////////////////////////////////
    app.get('/auth/google/',
      passport.authenticate('google', {
        scope: ['email', 'profile']//esto es lo que le pido a google
      }));
    app.get('/auth/google/callback', passport.authenticate('google', { //Recibe la autenticación que hace google
      successRedirect: '/', //Si la autenticación es correcta, te manda al home
      failureRedirect: '/login' //Si la autenticación es incorrecta, te manda de nuevo al login
    }));
    app.get('/', this._authGoogle.checkAuthenticated, this._goHome); //Hace lo mismo que el get de arriba ¿?

    app.post("/logout", (req, res) => {
      req.logOut(err => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/login");
    });     


    // Hace que el server se inicie en el puerto 3000
    app.listen(3000, () => console.log('Listening on port 3000'));    
  }

  async _login(req, res) {
    res.sendFile(path.join(__dirname, "public/login/login.html"));
  }

  async _goHome(req, res) {
    res.sendFile(path.join(__dirname, "public/home.html"));
  }

  async _doLookup(req, res) { //Cambiar a que se coencte con MOCKACHINO
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

}

new AgendaBackendServer();