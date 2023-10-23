// VIEW FOR THE SEARCH BAR
// this class isn't going to render anything but related to DOM so its a view - have DOM elements and stuff.
class SearchView {
  _parentEl = document.querySelector('.search');

  // get query from the search bar
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; // store query
    this._clearInput(); // clear input field
    return query; // return query
  }

  // clear input field after searching
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // publisher-subscriber pattern so we can not do DOM stuff in controller - want getQuery to happen on event listeners so need DOM elements.
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // prevent reloading the page
      handler();
    });
  }
}

export default new SearchView();
