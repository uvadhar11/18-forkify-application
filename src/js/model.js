// MODULE WHERE WE WRITE THE CODE FOR OUR ENTIRE MODEL
// exporting state [object] so controller can use it. Live connection between exports and imports. When this state object gets updated by the load recipe function, it will be automatically updated in the controller because of the live connection between imports and exports.
export const state = {
  recipe: {},
};

// function to fetch recipe data from API
export const loadRecipe = async function () {
  try {
    // fetch from api which returns a promise
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    // convert to json
    const data = await res.json();

    // handle error, api returns an error message which is descriptive
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(res);
    console.log(data);
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
    alert(err);
  }
};
