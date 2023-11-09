import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow(); // calling the function to show the window
    this._addHandlerHideWindow(); // calling the function to hide the window
  }

  // toggle window function we are going to call in the even listener so we don't have to worry about this keyword in event listeneres
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // controller doesn't need to interfere here because the controlelr doesn't need to do anything with this - so we are doing this with the constructor.
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // remember we need to use bind to manually set the this keyword of the function. We are binding it to the current object and not the button the event listener is attached to.
  }

  // close window
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // the x button will close the window when clicked
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // clicking on the overlay will close the window (the background stuff)
  }

  // handle form submission
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // prevent reloading
      const dataArr = [...new FormData(this)]; // using form data which is the data of the form and we pass in the form in the constructor. Using the spread operator so we can see the data in an array.
      const data = Object.fromEntries(dataArr); // fromEntries method converts an array of entries into an object. So we are converting the array of data into an object. The entries method is the opposite of the fromEntries method and it converts an object into an array of entries.
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
// need to import this in the controller.js file in order to actually run this file
