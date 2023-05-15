import express from 'express';
import passport from 'passport';
import db from './db.js';
import path from 'path';
import fs from 'fs';
import Authorization from "./auth.js"

const __dirname = fs.realpathSync('.');

class AgendaBackendServer {
  constructor() {
    
    const app = express();
    app.use(express.json());
    app.use(express.static('public')); //Le digo a express que busque las cosas directamente en la carpeta public
    app.use(express.urlencoded({ extended: false }));
    this._auth = new Authorization(app);
     
    app.get('/lookup/:destination', this._doLookup); //Cuando alguien busca un destino, se ejecuta la funcion _doLookup
    app.get('/login/', this._login);
    app.get('/auth/google/',
      passport.authenticate('google', {
        scope: ['email', 'profile']
      }));
    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));
    app.get('/', this._auth.checkAuthenticated, this._goHome);

    app.post("/logout", (req,res) => {
      req.logOut(err=>console.log(err));
      res.redirect("/login");
   })
  
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

}

new AgendaBackendServer();