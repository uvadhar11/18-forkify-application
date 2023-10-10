import * as model from './model.js'; // imports everything in the model js file as an object called model
import recipeView from './views/recipeView.js';

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
// npm init - makes our package.json file
const controlRecipcontrolRecipes = async function () {
  try {
    // getting hash from url - now we can load id based on the url
    const id = window.location.hash.slice(1); // cut the hash (first character) from id
    console.log(id);
    // ^^^ this is an example of application logic [in controller] because we need this to get handle the application logic.

    // if no id, then return so there is no error - guard clause
    if (!id) return;
    // rendering the spinner so when it isn't loading, the spinner will be there.
    renderSpinner(recipeContainer); // calling the spinner function. This disappears when the content is loaded because this goes into the recipe container element, then when the content is loaded, that SAME container is emptied and the new code with the content is added to the same container, resulting in the spinner being gone.

    // 1) Loading recipe
    // await will block the execution inside this async function. Becuase this is inside an async function, its not going to block the entire execution of the script.
    await model.loadRecipe(id); // calling the load recipe function from model.js. ASYNC FUNCTION SO RETURNS A PROMISE.

    // 2) Rendering recipe, from the data we got before
    recipeView.render(model.state.recipe); // render method from recipeView.js. We are passing in the recipe from the state object in model.js. This is the recipe object we got from the api. Popular nae=me for methods.
    // also possible: const recipeView = new recipeView(model.state.recipe)
  } catch (err) {
    // when throw error in try, this stuff is executed so the alert will happen with the err from try block since throwing an error.
    alert(err);
  }
};
controlRecipes();

// event listener for hash in url changing
// window.addEventListener('hashchange', controlRecipes);

// need to also add this event listener for when the page is loaded, so that the recipe is shown when the page is loaded since if u paste the url in a new tab, it won't load the recipe.
// window.addEventListener('load', controlRecipes);

// we have duplicated code so we can just put the events in an array and oop thru them since calling the same callback function
['hashchange', 'load'].forEach(theEvent =>
  window.addEventListener(theEvent, controlRecipes)
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
