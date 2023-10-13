// MODULE WHERE WE WRITE THE CODE FOR OUR ENTIRE MODEL
// exporting state [object] so controller can use it. Live connection between exports and imports. When this state object gets updated by the load recipe function, it will be automatically updated in the controller because of the live connection between imports and exports.
import { async } from 'regenerator-runtime'; // polyfilling async/await
import { API_URL } from './config.js'; // importing the api url from config.js. Can import all with *
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
};

// function to fetch recipe data from API
export const loadRecipe = async function (id) {
  try {
    // calling the getJSON helper function
    const data = await getJSON(`${API_URL}/${id}`);

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
  }
};
