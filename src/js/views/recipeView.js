// view is going to be a class because we are going to have a parent class called view that all views should inherit - easy to implement this with inheritance. We want some private properties for the views as well which classes will help us with.
class RecipeView {
  // storing the parent element from the DOM inside this parentElement instance variable.
  #parentElement = document.querySelector('/recipe');
  #data; // instance variable for the data.

  // part of the public api, we can pass data into this method since we don't have a constructor.
  render(data) {
    // stores data we get from calling the render method in the controller into this.#data
    this.#data = data;

    // rendering onto the screen
    const markup = this.#generateMarkup(); // calling the private method to generate the markup

    // clearing the parent element html
    this.#clear();

    // add html to parent
    this.#parentElement.insertAdjacentHTML('afterbegin', markup); // makes it as a first child since afterbegin
  }

  // private method to clear the parent element html - abstracting code into a method to make it cleaner in other methods.
  #clear() {
    this.#parentElement.innerHTML = '';
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
    this.#parentElement.innerHTML = ''; // clear the parent element
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // private method since render will be common for all the classes, the HTML will be different so we need a function to generate that.
  #generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this.#data.image}" alt="${
      this.#data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this.#data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.#data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this.#data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this.#data.ingredients
              .map(ing => {
                return `
              <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>
              `;
              })
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this.#data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this.#data.sourceUrl}"
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
}

export default new RecipeView(); // exporting default so we can import just the object into controller.js with no risk to making another instance of the class. Nothing outside the class can edit the class.
// if we exported the class, we would have to export the class and create an instance of the class. Not good because could create multiple instances of the class and because this creates unnecessary work for the controller.
