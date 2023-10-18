// MODULE WHERE WE WRITE THE CODE FOR OUR ENTIRE MODEL
// exporting state [object] so controller can use it. Live connection between exports and imports. When this state object gets updated by the load recipe function, it will be automatically updated in the controller because of the live connection between imports and exports.
import { API_URL } from './config.js'; // importing the api url from config.js. Can import all with *
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
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
  } catch (err) {
    console.error(`${err}💥💥💥💥`);
    throw err;
  }
};
loadSearchResults('pizza');
