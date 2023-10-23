// RESULTS VIEW IS FOR THE SHOWING THE SEARCH RESULTS (LIKE IN THE SIDEBAR). Code similar to some of the functionality in recipeView.js so we have a parent class we can inherit from (view.js)
import View from './view';
class ResultsView extends View {
  // parent element
  _parentElement = document.querySelector('.results');
}

export default new ResultsView();
// exporting an instance object of this class makes it so that we don't have to manually make an instance variable when using this in other modules.
