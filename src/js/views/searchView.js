// VIEW FOR THE SEARCH BAR
// this class isn't going to render anything but related to DOM so its a view - have DOM elements and stuff.
class SearchView {
  #parentEl = document.querySelector('.search');

  // get query from the search bar
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value; // store query
    this.#clearInput(); // clear input field
    return query; // return query
  }

  // clear input field after searching
  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  // publisher-subscriber pattern so we can not do DOM stuff in controller - want getQuery to happen on event listeners so need DOM elements.
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // prevent reloading the page
      handler();
    });
  }
}

export default new SearchView();
