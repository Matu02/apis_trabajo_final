import Agenda from "./agenda.js";
import Hotel from "./hotel.js";
import Activities from "./activities.js";
import Destination from "./destination.js";

class App {
  
  constructor() {
    this.agenda = new Agenda();
    this.destinationName = '';

    const searchForm = document.querySelector('#search'); //Selecciona el form de busqueda de destinos
    this._onSearch = this._onSearch.bind(this);
    this._showResults = this._showResults.bind(this);
    searchForm.addEventListener('submit', this._onSearch); //Cuando se hace el submit con el botón se ejecuta la función _onSearch
  }

  _onSearch(event) {
    event.preventDefault(); //Para no refrescar la pagina al enviar el form
    const input = document.querySelector('#destination-input'); //Selecciona el input donde se ingresó el destino buscado
    this.destinationName = input.value.trim(); //Se guarda el texto que ingresó el usuario, se le aplica el trim() por si el usuario puso espacios al escribir la palabra
    console.log(`Llego ${this.destinationName} a onSearch`);
    this.agenda.doLookup(this.destinationName) //Ejecuta la función doLookup con la destination ingresada. Esta función se creó en la clase agenda creada en agenda.js
      .then(filteredData => this._showResults(filteredData))
    //Después de ejecutar doLookup, que se ejecute la función para mostrar los resultados
  }

  _showResults(result) { //Toma el resultado del this.agenda.doLookup, que sería el resultado del fetch al backend (el result ya viene filtrado x provincia desde el backend)
    const desiredDestination = result; //Guarda el objeto de la provincia en la variable desiredDestination
    const resultsContainer = document.querySelector('#results');
    resultsContainer.classList.add('hidden');
    
    if (desiredDestination && !desiredDestination.error) { //Si existe una respuesta en desiredDestination y no hay un error en la busqueda, se crean los hoteles y actividades
      // Para mostrar el nombre del destino buscado
      new Destination(resultsContainer, desiredDestination);
      
      // Mostrar hoteles según lo programado en hotel.js
      new Hotel(resultsContainer, desiredDestination.hotels);
  
      // Mostrar actividades según lo programado en activities.js
      new Activities(resultsContainer, desiredDestination.activities);

      resultsContainer.classList.remove('hidden');
    } else {
      alert(`No se encontró el destino "${this.destinationName}"`);
    }
  }
}

const app = new App(); //Crea una instancia de la clase App, entonces se ejecuta todo el programa