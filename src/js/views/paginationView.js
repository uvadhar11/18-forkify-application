import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // generate the html for the pagination buttons - multiple scenarios we have to account for like first, last, or other pages
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.searchResultsPerPage
    );

    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return 'page 1, others';
    }
    // Last page (need second condition because we don't want to show last page if there is only 1 page - it should show page 1, and there are no other pages).
    if (this._data.page === numPages && numPages > 1) {
      return 'last page';
    }

    // Other page
    if (this._data.page < numPages) {
      return 'other page';
    }

    // Page 1, and there are NO other pages
    return 'only 1 page';
  }
}

export default new PaginationView();
