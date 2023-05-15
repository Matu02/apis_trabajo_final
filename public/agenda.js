class Agenda {

  doLookup(destination){
    return fetch('/lookup/' + destination) //Hace un fetch al servidor al endpoint lookup + el nombre del destino ingresado
    .then(response => response.json()) //Llega la respuesta en un json
  }
}

export default Agenda;