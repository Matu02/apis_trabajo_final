class Agenda {
  doLookup(destination) {
    return fetch('/lookup/' + destination)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        throw error;
      });
  }
}

export default Agenda;
