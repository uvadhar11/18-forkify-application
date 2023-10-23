// RESULTS VIEW IS FOR THE SHOWING THE SEARCH RESULTS (LIKE IN THE SIDEBAR). Code similar to some of the functionality in recipeView.js so we have a parent class we can inherit from (view.js)
import View from './view';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
class ResultsView extends View {
  // parent element
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    // since the stuff we search can have multiple results, we need to loop through the array of search and then return a html element string for each element.
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    return `
    <li class="preview">
      <a class="preview__link" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
        </div>
      </a>
    </li>
    `;
  }
}

export default new ResultsView();
// exporting an instance object of this class makes it so that we don't have to manually make an instance variable when using this in other modules.
