import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://matias:apistp123@trabajoapis.kaiimcg.mongodb.net/test";

const client = new MongoClient(connectionString);

let conn;
try { //trata de conectarse a la base de datos
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("trabajoViajes"); //Nombre de la db

export default db;