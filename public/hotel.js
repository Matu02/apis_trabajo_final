class Hotel {
  constructor(resultsContainer, hotel) {
    const nameDisplay = resultsContainer.queryselector('#hotel-name')
    const addressDisplay = resultsContainer.queryselector('#hotel-address')
    const priceDisplay = resultsContainer.queryselector('#hotel-price')
    
    nameDisplay.textContent = hotel.name;
    addressDisplay.textContent = hotel.address;
    priceDisplay.textContent = hotel.price;
  }
}

export default Hotel;