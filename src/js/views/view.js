// PARENT CLASS FOR SOME FUNCTIONALITY THAT IS SHARED BETWEEN VIEWS
// IMPORTANT NOTE: WE CANNOT ACCESS PRIVATE METHODS IN OTHER CLASSES EVEN IF INHERITED. THIS WORKS LIKE THIS IN ALL OOP AS WELL, JUST OTHER LANGUAGES HAVE PROTECTED FIELDS SO WE CAN ACCESS THEM IN INHERITED CLASSES. SO WE USE THE _ CONVENTION. WE CAN HAVE PROTECTED FIELDS AND METHODS IN TYPESCRIPT THOUGH.
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
// exporting the class since not using any instance variables.
export default class View {
  #data;

  // part of the public api, we can pass data into this method since we don't have a constructor.
  render(data) {
    // if no data or if data is an empty array, then render message. Guard clause here.
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // renders the error and we get the message in this.renderError automatically.

    // stores data we get from calling the render method in the controller into this._data
    this._data = data;

    // rendering onto the screen
    const markup = this._generateMarkup(); // calling the private method to generate the markup

    // clearing the parent element html
    this._clear();

    // add html to parent
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // makes it as a first child since afterbegin
  }

  // update method for updating text and the other elements
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError(); // renders the error and we get the message in this.renderError automatically.
    // removed this error because when updating the sidebar it doesn't render the new recipes and stuff because an empty array is returned.

    // stores data we get from calling the render method in the controller into this._data
    this._data = data;
    const newMarkup = this._generateMarkup(); // generating new markup and we are going to compare the new markup with the old markup and only update the parts that are different.
    // comparing the elements is hard because this is a string so can convert this to a DOM object and then compare the DOM objects.
    const newDOM = document.createRange().createContextualFragment(newMarkup); // creates a virtual DOM object from the markup string. This is a DOM object so we can compare it with the other DOM object (current html stuff being displayed). This new DOM object lives in memory and IS NOT displayed on the screen but we can use it like it was displayed on the screen.
    const newElements = Array.from(newDOM.querySelectorAll('*')); // selects all the elements in the newDOM and returns a node list, so we are converting it into an array with Array.from
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    newElements.forEach((newEl, index) => {
      const curEl = curElements[index]; // getting the current element. We are looping thru the new elements and then getting the current element from the current elements array.
      console.log(curEl, newEl.isEqualNode(curEl)); // isEqualNode compares the content between the nodes (don't have to be the same).Returns true or false.

      // if they aren't the same (are different), then change it AND we only want elements that are text. newEl is an element node and we need to get the firstChild node because it is text - for all elements that DON'T HAVE any text stuff, the first child will be null.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🍕🍕🍕🍕', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent; // remember that current element is the one on the html currently and so we want to update that one.
      }

      // we also need to change the CHNAGED data attributes as well. Since with the +/- servings buttons we have a dataset attribute for the servings number to update to.
      // UPDATE CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        console.log(Array.from(newEl.attributes));
        // convert attributes to an array so we can copy the changed attrbiutes into the current element (stuff displayed on the DOM)
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  // private method to clear the parent element html - abstracting code into a method to make it cleaner in other methods.
  _clear() {
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
