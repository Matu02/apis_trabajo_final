class Activities { //Esta clase se encarga de mostrar las actividades en el HTML
  constructor(resultsContainer, activities) {  //Recibe dos parametros, el contenedor donde se va a mostrar la clase y el objeto activities, que tiene los datos que se mostrarán
    const nameDisplay = resultsContainer.queryselector('#activity-name')
    const descriptionDisplay = resultsContainer.queryselector('#activity-description')
    const priceDisplay = resultsContainer.queryselector('#activity-price')
    
    nameDisplay.textContent = activities.name; //Hace que en el nameDisplay se muestre el nombre del objeto activities 
    descriptionDisplay.textContent = activities.description; //Lo mismo pero con la descripción
    priceDisplay.textContent = activities.price; //Lo mismo pero con el precio
  }
}

export default Activities;