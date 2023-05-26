class Hotel {
  constructor(resultsContainer, hotels) {
    const hotelsContainer = resultsContainer.querySelector('#hotels-container');
    hotelsContainer.innerHTML= '';
    
    hotels.forEach(hotel => {
      const hotelElement = document.createElement('div');
      hotelElement.classList.add('hotel');
      
      const nameElement = document.createElement('h3');
      nameElement.classList.add('hotel-name');
      nameElement.textContent = hotel.name;
      
      const addressElement = document.createElement('p');
      addressElement.classList.add('hotel-address');
      addressElement.innerHTML = `<strong>Dirección:</strong> ${hotel.address}`;
      
      const priceElement = document.createElement('p');
      priceElement.classList.add('hotel-price');
      priceElement.innerHTML = `<strong>Nivel de precios:</strong> ${hotel.price}`;
      
      hotelElement.appendChild(nameElement);
      hotelElement.appendChild(addressElement);
      hotelElement.appendChild(priceElement);
      
      hotelsContainer.appendChild(hotelElement);
    });
    
    console.log('Llegaron los hoteles a la clase Hotel');
  }
}

export default Hotel;