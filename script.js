//Script que sube automáticamente los datos de las provincias a la base de datos. 
//Para correrlo hay que poner node script.js en le terminal y se suben los datos del JSON que se llama destinations.json

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

const uri = "mongodb+srv://matias:apistp123@trabajoapis.kaiimcg.mongodb.net/test"

async function main() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to database successfully");

    const database = client.db('trabajoViajes');
    const collection = database.collection('datosDestinos');

    const rawdata = fs.readFileSync('destinations.json');
    const data = JSON.parse(rawdata);

    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted to the collection`);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
    console.log("Disconnected from database");
  }
}

main().catch(console.error);
