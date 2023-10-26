import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // publisher, subscriber method to add event listeners to the pagination buttons. Using event delegation so we don't need to put the event listeners on each button.
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); // seaches for closest parent with closest method. Accounts for the fact that the user might click on the svg or the span or the button itself. And if its btn--inline then itll just be btn-inline.

      // guard clause for if there is no button
      if (!btn) return;

      // get data from the button's data attribute called "goto" of what page to go to
      const goToPage = +btn.dataset.goto; // use the + to convert it to a number since its a string normally.

      handler(goToPage);
    });
  }

  // generate the html for the pagination buttons - multiple scenarios we have to account for like first, last, or other pages
  _generateMarkup() {
    const currentPage = this._data.page; // store current page in a variable.
    const numPages = Math.ceil(
      this._data.results.length / this._data.searchResultsPerPage
    );

    // IF current page is page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      // going to the next page which is why we do current page + 1
      // NO BACK BUTTON IF WE ARE ON THE FIRST PAGE, ONLY FORWARD BUTTONS
      return `
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // Last page (need second condition because we don't want to show last page if there is only 1 page - it should show page 1, and there are no other pages).
    if (currentPage === numPages && numPages > 1) {
      // going to the previous page which is why we do current page - 1 (NO FORWARD BUTTON IF ON THE LAST PAGE, ONLY THE BACK ONE)
      return `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }

    // Other page
    if (currentPage < numPages) {
      // include both forward and backward buttons
      return `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Page 1, and there are NO other pages
    return ''; // don't need any buttons then if this is the only page.
  }
}

export default new PaginationView();
