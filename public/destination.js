class Destination {
  constructor(resultsContainer, destination) {
    const nameDisplay = resultsContainer.querySelector('#destination-name');//en resultContainer se busca un ID destination-name y se guarda en nameDispay 
    nameDisplay.textContent = destination.name;//se asigna contenido de texto
    console.log(destination.name);

  }
}

export default Destination;