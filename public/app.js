

class App {
  constructor() {
    this.dictionary = new Dictionary();

    const searchForm = document.querySelector('#search');
    this._onSearch = this._onSearch.bind(this);
    searchForm.addEventListener('submit', this._onSearch);
  }
}