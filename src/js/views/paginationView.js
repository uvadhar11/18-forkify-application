import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // generate the html for the pagination buttons - multiple scenarios we have to account for like first, last, or other pages
  _generateMarkup() {
    // Page 1, and there are other pages
    // Page 1, and there are NO other pages
    // Last page
    // Other page
  }
}

export default new PaginationView();
