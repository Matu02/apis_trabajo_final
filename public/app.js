import Agenda from "./agenda.js";
import Hotel from "./hotel.js";
import Activities from "./activities.js";
import Destination from "./destination.js";

class App {
  
  constructor() {
    this.agenda = new Agenda();

    const searchForm = document.querySelector('#search'); //Selecciona el form de busqueda de destinos
    this._onSearch = this._onSearch.bind(this);
    searchForm.addEventListener('submit', this._onSearch); //Cuando se hace el submit con el botón se ejecuta la función _onSearch
  }

  _onSearch(event) {
    event.preventDefault(); //Para no refrescar la pagina al enviar el form
    const input = document.querySelector('#destination-input'); //Selecciona el input donde se ingresó el destino buscado
    const destination = input.value.trim(); //Se guarda el texto que ingresó el usuario, se le aplica el trim() por si el usuario puso espacios al escribir la palabra
    this.agenda.doLookup(destination) //Ejecuta la función doLookup con la destination ingresada. Esta función se creó en la clase agenda creada en agenda.js
      .then(this._showResults) //Después de ejecutar doLookup, que se ejecute la función para mostrar los resultados
  }

  _showResults(result) {
    const resultsContainer = document.querySelector('#results'); //Selecciona el contenedor donde se mostrarán los resultados
    resultsContainer.classList.add('hidden');

    //Para que se muestre el nombre del destino buscado
    new Destination(resultsContainer, result)

    // Mostrar hoteles según lo programado en hotel.js
    new Hotel(resultsContainer, result); //El objeto result tiene los hoteles adentro

    //Mostrar actividades según lo programado en activities.js
    new Activities(resultsContainer, result); //El objeto result tiene las activities adentro

    // Mostrar en el HTML al sacarle el hidden
    resultsContainer.classList.remove('hidden');
  }
}

const app = new App(); //Crea una instancia de la clase App, entonces se ejecuta todo el programa