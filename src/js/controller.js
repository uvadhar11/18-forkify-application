// import icons from '../img/icons.svg'; // Parcel 1 - how this works in parcel 1 for importing the icons (.. is to go up one level)
import icons from 'url:../img/icons.svg'; // for static assets (non programming files like video, img, sound) we need to add url:PATH
// need to import images since when the build is done, the image reference in the html goes to a different area and not the one in the dist folder. So see imports and comments above.
import 'core-js/stable'; // don't need to save it anywhere, for plyfilling everything else (regenerator runtime does async/await)
import 'regenerator-runtime/runtime'; // polyfilling async/await
console.log(icons);
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

// polyfilling for old code: npm i core-js regenerator-runtime (installs 2 packages at the same time). Remember to import at the top of the file.

///////////////////////////////////////
// function to make a spinner when loading
const renderSpinner = function (parentEl) {
  // the spinner class has a spinner in the css
  const markup = `
  <div class='spinner'>
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
  parentEl.innerHTML = ''; // clear the parent element
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

// npm init - makes our package.json file
const showRecipe = async function () {
  try {
    // getting hash from url - now we can load id based on the url
    const id = window.location.hash.slice(1); // cut the hash (first character) from id
    console.log(id);

    // if no id, then return so there is no error - guard clause
    if (!id) return;

    // 1) Loading recipe
    renderSpinner(recipeContainer); // calling the spinner function. This disappears when the content is loaded because this goes into the recipe container element, then when the content is loaded, that SAME container is emptied and the new code with the content is added to the same container, resulting in the spinner being gone.

    // fetch from api which returns a promise
    const res = await fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    // convert to json
    const data = await res.json();

    // handle error, api returns an error message which is descriptive
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(res);
    console.log(data);
    let { recipe } = data.data; // getting recipe from data.data
    // making a new object from the json info since sometimes has underscores which is unusual for js
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    // 2) Rendering recipe, from the data we got before
    const markup = `
    <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
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
            ${recipe.ingredients
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
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
    // need to empty the html before adding the new one
    recipeContainer.innerHTML = '';
    // add html to parent
    recipeContainer.insertAdjacentHTML('afterbegin', markup); // makes it as a first child since afterbegin
  } catch (err) {
    // when throw error in try, this stuff is executed so the alert will happen with the err from try block since throwing an error.
    alert(err);
  }
};
showRecipe();

// event listener for hash in url changing
// window.addEventListener('hashchange', showRecipe);

// need to also add this event listener for when the page is loaded, so that the recipe is shown when the page is loaded since if u paste the url in a new tab, it won't load the recipe.
// window.addEventListener('load', showRecipe);

// we have duplicated code so we can just put the events in an array and oop thru them since calling the same callback function
['hashchange', 'load'].forEach(theEvent =>
  window.addEventListener(theEvent, showRecipe)
);

///////////////////////////////////////
// NOTES
// MVC ARCHITECTURE
// structure, maintainability, expandability is needed which is why we need a perfect architecture - we can make our own architecture (like with small projects), or for big projects - we can use a well established pattern like MVC, MVP, Flux, etc.
// we can use a framework like React, Angular, Vue, etc. which has a built in architecture
// components of any architecture: business logic (logic solving the problem/business does and needs like for banking its storing transactions), state (or application state - stores all data about application like page user using and stuff - single source of truth, ui is based on that - many state management libraries like redux or mobX), http library (make and recieve ajax requests like with fetch - most real world applications need this), application logic/router (implementation of application, handles navigation and UI events), persentation logic/ui layer (concerned with the visual part and displays the application state)
// NEED a way to separate these components so we use MVC - model-view-controller architecture.
// view - interacts with user/presentation logic
// model - business logic, state, http library like data from web/backend
// controller - application logic/router, connects view and model since view and model should exist completely independent from each other.
// a goal of this model is to seperate business and presetnation logic so we need this controller to connect them both.
// controller handles ui events and dispatches tasks to model and view. GETS UI EVENTS AS WELL.
