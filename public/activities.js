class Activities {
  constructor(resultsContainer, activites) {//un constructor con dos argumentos
    const activitiesContainer = resultsContainer.querySelector('#activities-container');
    activitiesContainer.innerHTML= '';//Asegura que el contenedor esté vacio para agregar las actividades
    
    activites.forEach(activity => {//forEach se refiere para cada actividad hace lo siguiente
      const activityElement = document.createElement('div'); //Crea un div
      activityElement.classList.add('activity');//asigna una actividad
      
      const nameElement = document.createElement('h3');//dentro del div creo un titulo
      nameElement.classList.add('activity-name');
      nameElement.textContent = activity.name;
      
      const descriptionElement = document.createElement('p');//dentro del div creo un parrafo
      descriptionElement.classList.add('activity-description');//El parrafo tiene la descripcion
      descriptionElement.innerHTML = `<strong>Descripción:</strong> ${activity.description}`;
      
      const priceElement = document.createElement('p');//dentro del div creo un parrafo
      priceElement.classList.add('activity-price');//contiene precio
      priceElement.innerHTML = `<strong>Nivel de precios:</strong> ${activity.price}`;
      
      activityElement.appendChild(nameElement);//Aca agrego el h3 y los p como hijos al div
      activityElement.appendChild(descriptionElement);
      activityElement.appendChild(priceElement);
      
      activitiesContainer.appendChild(activityElement);//se agrega todo completo al contenedor
    });
    
    console.log('Llegaron los actividades a la clase activities');
  }
}

export default Activities;
