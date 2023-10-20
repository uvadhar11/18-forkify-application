// RESULTS VIEW IS FOR THE SHOWING THE SEARCH RESULTS (LIKE IN THE SIDEBAR). Code similar to some of the functionality in recipeView.js so we have a parent class we can inherit from (view.js)
import View from './view';
class ResultsView extends View {
  // parent element
  _parentEl = document.querySelector('.results');
}
