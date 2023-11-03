// MODULE WHERE WE WRITE THE CODE FOR OUR ENTIRE MODEL
// exporting state [object] so controller can use it. Live connection between exports and imports. When this state object gets updated by the load recipe function, it will be automatically updated in the controller because of the live connection between imports and exports.
import { API_URL, RESULTS_PER_PAGE } from './config.js'; // importing the api url from config.js. Can import all with *
import { getJSON } from './helpers.js';

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

// function to fetch recipe data from API
export const loadRecipe = async function (id) {
  try {
    // calling the getJSON helper function
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data; // getting recipe from data.data
    // making a new object from the json info since sometimes has underscores which is unusual for js
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
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

    const data = await getJSON(`${API_URL}?search=${query}`); // get json is a helper function that makes the api call and returns the json data
    console.log(data);
    // data.data.recipes is where our searched recipes are and here we are making our object from that and then storing it in the state
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
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

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark (if the current recipe id is the same one as the recipe that we are passing in (the one we are going to click on to look at next), then set this recipe as being bookmarked so the icon and stuff shows up)
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};
