import express from 'express';
import passport from 'passport';
import db from './db.js';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
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
    app.get('/lookup/:destination', this._doLookup);

////////////////////////////////////LOGIN LOCAL///////////////////////////////////////////

    app.get('/', this._authLocal.checkAuthenticated, this._goHome); //Este get es para que se muestre el home. Pero para poder hacerlo, antes chequea que estes autenticado localmente
    app.post(`/login/`, passport.authenticate(`local`, {failureRedirect: `/login`}))//Hago que passport autentique, si no estoy autenticado vuelve a login.

////////////////////////////////////LOGIN GOOGLE///////////////////////////////////////////
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

  //FETCH A MOCKACHINO

  async _doLookup(req, res) {
    try {//que intente hacer esta funcion y si salta error va a catch
      const destination = req.params.destination;//en una constante destination trae (req) el parametro de la api llamado destination que es donde esta todo
      const url = `https://www.mockachino.com/46903af7-1a7d-4d/destinations/`;
  
      const response = await fetch(url);//hace un fetch para traer la url. await hace que hasta que la linea de codigo anterior es decir la promesa no se ejecute. Todo se guarda en response
      const data = await response.json();//la respuesta se almacena en data y esta en json


      console.log('Datos recibidos desde el backend:', data);//me fijo en la consola si data llego bien
  
      res.json(data);//me da la respuesta y me tira data
    } catch (error) {//si hay un error salta esto
      console.error('Error al obtener los datos de Mockachino:', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  }
}

new AgendaBackendServer();