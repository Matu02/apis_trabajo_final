class Agenda {
  doLookup(destination) {
    return fetch('/lookup/' + destination)//obtengo los datos de los destinos
      .then(response => {
        return response.json();//que la respuesta sea en Json
      })
      .then(data => {
        console.log(data);//se muestra en la consola los datos obtenidos
        return data;//obtengo los datos del fetch
      })
      .catch(error => {//si ocurre un error pasa esto
        console.error('Error al obtener los datos:', error);
        throw error;
      });
  }
}

export default Agenda;
