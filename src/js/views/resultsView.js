// RESULTS VIEW IS FOR THE SHOWING THE SEARCH RESULTS (LIKE IN THE SIDEBAR). Code similar to some of the functionality in recipeView.js so we have a parent class we can inherit from (view.js)
import View from './view';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
import previewView from './previewView';

class ResultsView extends View {
  // parent element
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    // since the stuff we search can have multiple results, we need to loop through the array of search and then return a html element string for each element.
    return this._data.map(result => previewView.render(result, false)).join(''); // we want to call the render method instead of just calling a the preview view generate markup because we need the data setting stuff, etc.
  }
}

export default new ResultsView();
// exporting an instance object of this class makes it so that we don't have to manually make an instance variable when using this in other modules.
