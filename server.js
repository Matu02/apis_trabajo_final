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
      const destination = req.params.destination; //la request hecha desde el frontend (lo q escribió el usuario) se guarda en la variable destination. Es solo un string con el nombre de la provincia q buscó el usuario
      const normalizedDestination = destination.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, ""); //Normalizo el texto ingresado por el usuario, lo pone en minuscula, elimina espacios en el medio y elimina los acentos
      const url = `https://www.mockachino.com/46903af7-1a7d-4d/destinations/`; //Guardo la url de mockachino en una variable
  
      const response = await fetch(url); //hace un fetch para traer la url. await hace que hasta que la linea de codigo anterior es decir la promesa no se ejecute. Todo se guarda en response
      const data = await response.json(); //la respuesta recibida del fetch se almacena en data en fomarto JSON

      //Filtro la info que se enviará al frontend según lo que haya pedido el usuario
      const filteredData = data.destinations.find(destinations => { //Se busca dentro de las destinations que hay en mockachino (osea busca entre todas las provincias)
        const normalizedName = destinations.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, ""); //Se normaliza el nombre del destino de igual forma que se normalizó antes el destino ingresado x el usuario
        return normalizedName === normalizedDestination; //Si los datos nombres coinciden, se guarda el objeto de la provincia en filteredDara, sino filteredData quedará como undefined
      });

      console.log('Datos recibidos y filtrados desde el backend:', filteredData); //me fijo en la consola si los datos llegaron y se filtraron bien

      if (filteredData) { //Si la busqueda es exitosa,
        res.json(filteredData); //Entonces se envía como JSON al frontend
      } else {
        res.status(404).json({ error: 'No se encontraron resultados' }); //Si no es exitosa se envía este error al frontend
      }

    } catch (error) {//si hay un error para buscar los datos salta esto
      console.error('Error al obtener los datos de Mockachino:', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  }
}

new AgendaBackendServer();