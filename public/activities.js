class Activities {
  constructor(resultsContainer, activites) {
    const activitiesContainer = resultsContainer.querySelector('#activities-container');
    activitiesContainer.innerHTML= '';
    
    activites.forEach(activity => {
      const activityElement = document.createElement('div');
      activityElement.classList.add('activity');
      
      const nameElement = document.createElement('h3');
      nameElement.classList.add('activity-name');
      nameElement.textContent = activity.name;
      
      const descriptionElement = document.createElement('p');
      descriptionElement.classList.add('activity-description');
      descriptionElement.innerHTML = `<strong>Descripción:</strong> ${activity.description}`;
      
      const priceElement = document.createElement('p');
      priceElement.classList.add('activity-price');
      priceElement.innerHTML = `<strong>Nivel de precios:</strong> ${activity.price}`;
      
      activityElement.appendChild(nameElement);
      activityElement.appendChild(descriptionElement);
      activityElement.appendChild(priceElement);
      
      activitiesContainer.appendChild(activityElement);
    });
    
    console.log('Llegaron los actividades a la clase activities');
  }
}

export default Activities;
