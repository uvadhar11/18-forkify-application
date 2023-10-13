// contains helper functions that we constantly reuse throughout the application. An example is converting json.
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // fetch from api which returns a promise
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // using url here and not the actual url "hardcoded" so we can use it for any url.
    // using Promise.race here which allows for letting us stop the fetch if the timeout function ends first (we can do a 0.5 seconds timeout). Remember Promise.race is an array of the promises and returns the rejected/fulfilled value of the promise.
    // having just 10 here makes it look like a random magic number that doesn't really do anything so we need to include this in the config.js file so we can understand what this number is for.

    // convert to json
    const data = await res.json();

    // handle error, api returns an error message which is descriptive
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data; // return the actual data. will become the resolved value of the promise.
  } catch (err) {
    // console.log(err);
    throw err; // throwing the error so we can handle it in the model js file, which will become the rejected value of the promise. This is like propagating the error down with async functions.
  }
};
