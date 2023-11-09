// config file like all the variables we are going to use in the project - basically like the config object with options. Only put variables responsible for displaying important information of the application. Like the API URL - may change sometimes so its good to have it here.
// export so we can use in other modules, all uppercase because its a constant
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/'; // url should end in a slash
export const TIMEOUT_SEC = 10; // might want to change the seconds time for the timeout function.
export const RESULTS_PER_PAGE = 10; // number of search results that show up per page
export const KEY = '6ca14c0b-0d87-43f9-b3c1-79801f0ab84e';
export const MODAL_CLOSE_SEC = 2.5; // seconds for the modal to close
