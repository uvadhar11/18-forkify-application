import * as model from './model.js'; // imports everything in the model js file as an object called model
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable'; // don't need to save it anywhere, for plyfilling everything else (regenerator runtime does async/await)
import 'regenerator-runtime/runtime'; // polyfilling async/await
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

// polyfilling for old code: npm i core-js regenerator-runtime (installs 2 packages at the same time). Remember to import at the top of the file.

///////////////////////////////////////
// npm init - makes our package.json file

// HOT POCKET MODULE WITH PARCEL TO PRESERVE THE STATE OF OUR APPLICATION ACROSS CHANGES (RELOADS) - not real JS, this is coming from parcel.
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // getting hash from url - now we can load id based on the url
    const id = window.location.hash.slice(1); // cut the hash (first character) from id
    // ^^^ this is an example of application logic [in controller] because we need this to get handle the application logic.

    // if no id, then return so there is no error - guard clause
    if (!id) return;
    // rendering the spinner so when it isn't loading, the spinner will be there.
    recipeView.renderSpinner(); // calling the spinner function. This disappears when the content is loaded because this goes into the recipe container element, then when the content is loaded, that SAME container is emptied and the new code with the content is added to the same container, resulting in the spinner being gone.
    // WHY IT WORKS: Calling render spinner on recipe view works because the function uses the paretntElement variable that stores this.

    // 0) Update results view to mark selected search result (basically the recipes that you are looking at need to be shaded in to imitate being selected on the sidebar)
    resultsView.update(model.getSearchResultsPage()); // updating the selected recipe in the sidebar(if it has changed). As the hash changed, the recipe in the sidebar was selected accordingly. Using update and not render to not re-render all the images (causes flickering as they are loading in)

    // 1.5) Updating bookmarks view
    // debugger; // debugging view that is handy for seeing the objects and everything that you have
    bookmarksView.update(model.state.bookmarks); // highlighting the preview in the bookmarks tab if the recipe is bookmarked and is the current one.

    // 1) Loading recipe
    // await will block the execution inside this async function. Becuase this is inside an async function, its not going to block the entire execution of the script.
    await model.loadRecipe(id); // calling the load recipe function from model.js. ASYNC FUNCTION SO RETURNS A PROMISE.

    // 2) Rendering recipe, from the data we got before
    recipeView.render(model.state.recipe); // render method from recipeView.js. We are passing in the recipe from the state object in model.js. This is the recipe object we got from the api. Popular name for methods.
    // also possible: const recipeView = new recipeView(model.state.recipe)
  } catch (err) {
    // when throw error in try, this stuff is executed so the alert will happen with the err from try block since throwing an error.
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

// event listener for hash in url changing
// window.addEventListener('hashchange', controlRecipes);

// need to also add this event listener for when the page is loaded, so that the recipe is shown when the page is loaded since if u paste the url in a new tab, it won't load the recipe.
// window.addEventListener('load', controlRecipes);

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
// a goal of this model is to seperate business and presentation logic so we need this controller to connect them both.
// controller handles ui events and dispatches tasks to model and view. GETS UI EVENTS AS WELL.
// for the callback handling - events should be handled in controller so application logic isn't in view, and events should be listened for in the view (since otherwise we need DOM elements in the controller). SO solution is publisher-subscriber design pattern.
// Design pattern = way to solve problems like common problems
// so in the publisher-subscriber pattern, we have a code that knows when to react (LISTENS) (publisher) like addHandlerRender in RecipeView and then subscriber is the code that reacts (HANDLES) which should be in controller.js
// since controller js has view and model but in init, and we dont use it anywhere else, we can pass the function into addHandlerRender in recipe view. - addHandlerRender has no control because it has to call the input function given - which is what we want. Calling a function is different than calling an input function.
// this updates every time something happens since the code has event listeners so they will auto update and be called when the event happens.

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // render spinner works here because render spinner is a method on the parent View class (inheritance). Loading spinner for the results.

    // 1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return; // guard clause if no query

    // 2. Load Search Results
    await model.loadSearchResults(query); // need to search the QUERY, so we pass it in and we want it to wait for the stuff to show up so we have an await (while loading, there is a spinner)

    // 3. Render Results [INITIAL rendering for the buttons]
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // passing the data from the model state into the render function of the results view. Default page number is number 1 in because that is the number we want to start at.

    // 4. Render INITIAL Pagination Buttons
    paginationView.render(model.state.search); // renders the buttons at the start and the control Pagination button will render the new buttons when we click on them.
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage)); // this get search results page method will get the argument for the new page we want to go to and then it will update the value in the page.
  // render overrides the previous markup because the parent element is cleared in the render method.

  // 4. Render NEW Pagination Buttons
  paginationView.render(model.state.search);
};

// changing the servings value. These are basically the event handlers that we will pass in.
const controlServings = function (newServings) {
  console.log(newServings);
  // update the recipe servings (in the state - model handles the data/state so we have a method in the model to update the servings stuff)
  model.updateServings(newServings); // want to keep this method robust, so we are not determining the newServings inside of this method.

  // update the recipe view (the numbers for the ingredients) - we are just rendering the entire recipe view again so we don't have to select each individual element and change the value.
  // recipeView.render(model.state.recipe);

  // we can use the update method that we are gonna write so the image for the recipes isnt updated to make it faster and so the image doesn't flicker
  recipeView.update(model.state.recipe);
};

// adding bookmarks controller - this is run when we click the bookmark button
const controlAddBookmark = function () {
  // 1. Toggle bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe); // updating the recipe view so the bookmark icon changes. Passing in the current recipe.

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks); // we stored all thed ata about the bookmarks in the state so we can preview the stuff in this tab.
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// calling the init function so we can get the event listeners going in the recipe view and then we pass the handler function into the addHandlerRender function in recipeView.js. Used for implementing the publisher-subscriber pattern.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // event stuff for bookmarks
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings); // event stuff for updating the servings.
  recipeView.addHandlerAddBookmark(controlAddBookmark); // event stuff for adding a bookmark
  searchView.addHandlerSearch(controlSearchResults); // for the search
  paginationView.addHandlerClick(controlPagination);
  // state.recipe is not defined yet because we are not taking into account the async nature of the application. These things above are just attaching the event handlers and the application doesn't have time to load everything yet <- the application works fine since we are just attaching event listeners here and not calling the handler yet.
};
init();
