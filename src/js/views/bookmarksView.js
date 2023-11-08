// BOOKMARKS VIEW is for the preview elements in the bookmarks tab for the recipes that have been bookmarked
import View from './view';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
import previewView from './previewView';

class BookmarksView extends View {
  // parent element
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler); // when the page loads, we want to render the bookmarks
  }

  _generateMarkup() {
    // since the stuff we search can have multiple results, we need to loop through the array of search and then return a html element string for each element.
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); // we want to call the render method instead of just calling a the preview view generate markup because we need the data setting stuff, etc.
  }
}

export default new BookmarksView();
// exporting an instance object of this class makes it so that we don't have to manually make an instance variable when using this in other modules.
