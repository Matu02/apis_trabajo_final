class Destination {
  constructor(resultsContainer, destination){
    const nameDisplay = resultsContainer.querySelector('#destination-name')

    nameDisplay.textContent = destination.name;

  }
}

export default Destination;