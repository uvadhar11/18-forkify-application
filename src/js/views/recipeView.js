// import icons from '../img/icons.svg'; // Parcel 1 - how this works in parcel 1 for importing the icons (.. is to go up one level)
import icons from 'url:../../img/icons.svg'; // for static assets (non programming files like video, img, sound) we need to add url:PATH
// need to import images since when the build is done, the image reference in the html goes to a different area and not the one in the dist folder. So see imports and comments above.
import View from './view';
import { Fraction } from 'fractional'; // npm package for converting decimals to fractions. Don't have to specify a path for packages we get from npm and we have to get what they export, which for this library it is Fraction. In the docs we can see they are using common js stuff and using require. Using destructuring to get the Fraction class from the object that is exported since theres 2.

// view is going to be a class because we are going to have a parent class called view that all views should inherit - easy to implement this with inheritance. We want some private properties for the views as well which classes will help us with.
class RecipeView extends View {
  // storing the parent element from the DOM inside this parentElement instance variable.
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one.';
  _message = '';

  // needs to be part of public api so we can call this in the controller. This function is called in init and then whenever the events happen, they will be called because this is in an event listener so since we run it once, itll be good.
  addHandlerRender(handler) {
    // handler function is the input function for the handler when the event happens.

    // we have duplicated code so we can just put the events in an array and oop thru them since calling the same callback function
    ['hashchange', 'load'].forEach(theEvent =>
      window.addEventListener(theEvent, handler)
    );
  }

  // handler for updating servings.
  addHandlerUpdateServings(handler) {
    // event delegation for the increase and decrease servings buttons
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return; // guard clause if no btn exists
      const { updateTo } = btn.dataset; // remember that data properties with dashes convert into camelcase. Remember to convert it to a number. Cannot do this: const {updateTo} = +btn.dataset because we can't convert the number with the plus sign like this. Prefer destructuring in case the object changes and stuff, so we can convert it to a number in the if statement.
      if (+updateTo > 0) handler(+updateTo); // only call the handler to update the servings number. Remember to convert both places into a number.
    });
  }

  addHandlerAddBookmark(handler) {
    // doing event delegation again - putting the event on a parent element since we can't select it on an element that doesn't exist yet (btn might not have loaded yet)
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  // private method since render will be common for all the classes, the HTML will be different so we need a function to generate that.
  _generateMarkup() {
    console.log(this._data);
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(ing => this._generateMarkupIngredient(ing))
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  // refactored method for generating the markup for the ingredients, cleaner than putting it all in the map
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeView(); // exporting default so we can import just the object into controller.js with no risk to making another instance of the class. Nothing outside the class can edit the class.
// if we exported the class, we would have to export the class and create an instance of the class. Not good because could create multiple instances of the class and because this creates unnecessary work for the controller.
