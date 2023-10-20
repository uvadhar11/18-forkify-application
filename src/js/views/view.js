// PARENT CLASS FOR SOME FUNCTIONALITY THAT IS SHARED BETWEEN VIEWS
// IMPORTANT NOTE: WE CANNOT ACCESS PRIVATE METHODS IN OTHER CLASSES EVEN IF INHERITED. THIS WORKS LIKE THIS IN ALL OOP AS WELL, JUST OTHER LANGUAGES HAVE PROTECTED FIELDS SO WE CAN ACCESS THEM IN INHERITED CLASSES. SO WE USE THE _ CONVENTION. WE CAN HAVE PROTECTED FIELDS AND METHODS IN TYPESCRIPT THOUGH.
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
// exporting the class since not using any instance variables.
export default class View {
  #data;

  // part of the public api, we can pass data into this method since we don't have a constructor.
  render(data) {
    // stores data we get from calling the render method in the controller into this._data
    this._data = data;

    // rendering onto the screen
    const markup = this._generateMarkup(); // calling the private method to generate the markupz

    // clearing the parent element html
    this._clear();

    // add html to parent
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // makes it as a first child since afterbegin
  }

  // private method to clear the parent element html - abstracting code into a method to make it cleaner in other methods.
  #clear() {
    this._parentElement.innerHTML = '';
  }

  // function to make a spinner when loading
  renderSpinner = function () {
    // the spinner class has a spinner in the css
    const markup = `
    <div class='spinner'>
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear(); // clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // error rendering function
  renderError(message = this._errorMessage) {
    // default error message if no message passed in
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear(); // clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // insert html into parent element
  }

  // message rendering function
  // error rendering function
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear(); // clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // insert html into parent element
  }
}
