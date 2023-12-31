// MODULE WHERE WE WRITE THE CODE FOR OUR ENTIRE MODEL
// exporting state [object] so controller can use it. Live connection between exports and imports. When this state object gets updated by the load recipe function, it will be automatically updated in the controller because of the live connection between imports and exports.
import { API_URL, KEY, RESULTS_PER_PAGE } from './config.js'; // importing the api url from config.js. Can import all with *
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    searchResultsPerPage: RESULTS_PER_PAGE, // number of search results that show up per page
  },
  bookmarks: [], // array for the bookmarks
};

const createRecipeObject = function (data) {
  const { recipe } = data.data; // getting recipe from data.data with destructuring and stuff.
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: +recipe.servings,
    cookingTime: +recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // doing short circuiting so we can add key if the key already exists because sometimes the key doesn't exist since user created recipes have keys and others don't. ADDING THIS TO THE OBJECT.
  };
};

// function to fetch recipe data from API
export const loadRecipe = async function (id) {
  try {
    // calling the getJSON helper function
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // we are adding the key and stuff in the API CALL NOT IN THE URL DISPLAYED ON THE SCREEN because this is a good practice in the real world becuase it can be used to authentication and other pages, etc.

    const { recipe } = data.data; // getting recipe from data.data
    // making a new object from the json info since sometimes has underscores which is unusual for js
    state.recipe = createRecipeObject(data);
    // since we load recipes from the api directly, we need to mark those that are bookmarked when loading the recipe so the bookmarked one stays
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      // loops through the bookmarks array and if the id of the bookmarks equals the id of the recipe we are loading, then set the bookmarked property to true. The some method returns true (if statement is run) if ANY of the element of the array past the test.
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // temp error handling
    console.error(`${err}💥💥💥💥`);
    throw err; // need to throw the error to mark this promise as rejected since there are multiple async functions.
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query; // storing the query in the state object in case we need it.

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // get json is a helper function that makes the api call and returns the json data
    // adding the key so we can show an icon on the recipes that are created by the user
    // the recipes are also linked to API keys so we won't see like the ones Jonas uploads for example.
    console.log(data);
    // data.data.recipes is where our searched recipes are and here we are making our object from that and then storing it in the state
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        // sourceUrl: recipe.source_url,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1; // need to reset the page for the search results back to 1 because a bug when searching for something and then clicking on a recipe and then going back to the search results, the page number would be the same as the page number for the recipe we clicked on (page number needs to be reset after new searches).
  } catch (err) {
    console.error(`${err}💥💥💥💥`);
    throw err;
  }
};

// function for returning part of the search results data - we pass in a page number and return 10 results based on the page number. Ex page 1 -> return result 0-9 (array index), page 2-> 10-19, etc.
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // storing the page argument into our state object so other files can access this.
  // get start and end variable based on the page number passed in (default is state.search.page)
  const start = (page - 1) * state.search.searchResultsPerPage; // page - 1 to get index then multiply it by number of results per page.
  const end = page * state.search.searchResultsPerPage; // page number times 10. Not subtracting 1 because slice is exclusive on the last value (won't include 10, the last value will be 9).

  return state.search.results.slice(start, end);
};

// updates state of the servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // Looping through each ingredient (an object) to update the quantity based on the servings we want. We want to update and not make a new object.
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // formula to calculate the new quantity = old quantity * new servings / old servings. Example: 2 * 8 / 4 = 4
  });
  // update state with the new servings number
  state.recipe.servings = newServings;
};

// function for handling local storage bookmark storing (persisting the bookmarks across page loads)
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark (if the current recipe id is the same one as the recipe that we are passing in (the one we are going to click on to look at next), then set this recipe as being bookmarked so the icon and stuff shows up)
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// when we want to add stuff we get all the data and when we want to delete something we get only the data to delete
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id); // find the index of the id we want to delete (id corresponding with the recipe)
  state.bookmarks.splice(index, 1); // start at index and remove one element (mutates the array)

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // parse converts the string back to an object
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks(); // clears the bookmarks in local storage

// uplaod recipe data - its API stuff so that stays in the model.
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim()); // trim removes the whitespace from the beginning and end of the string (not in the middle) so the white spaces in ingredients won't get messed up like with tomato sauce

        // since we are splitting the inputs in 3 parts, if there aren't 3 parts, then we throw an error since wrong format.
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // filtering out the ingredients to make sure they have ingredients and more than one ingredient then mapping through them to format them properly so we can use them.

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    // sending the data
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); // calling the send json function - the api url and the data you want to send.
    // console.log(data);
    state.recipe = createRecipeObject(data); // creating the recipe object from the data we get back from the api`

    // add a bookmark to the new recipe the user just made
    addBookmark(state.recipe);
  } catch (err) {
    throw err; // in async function so promise is returned. So error will say uncaught in promise, if there is an error in the promise stuff so that's why we need a try catch block.
  }
};
