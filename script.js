'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//Lecture 243

/* Working with APIS */

const renderCountry = function (country, className = '') {
  const html = `
          <article class="country ${className}">
            <img class="country__img" src="${country.flag}" />
            <div class="country__data">
              <h3 class="country__name">${country.name}</h3>
              <h4 class="country__region">${country.region}</h4>
              <p class="country__row"><span>👫</span>${(
                +country.population / 1000000
              ).toFixed(1)}M people</p>
              <p class="country__row"><span>🗣️</span>${
                country.languages[0].name
              }</p>
              <p class="country__row"><span>💰</span>${
                country.currencies[0].name
              }</p>
            </div>
          </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.style.opacity = 1;
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(resp => {
    if (!resp.ok) throw new Error(`${errorMsg}`);
    return resp.json();
  });
};

const getCountryAndNeighbors = function (country) {
  //creating the request

  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(data => {
      //handling error if country not found
      if (!data.ok) {
        throw new Error('Country not found');
      }

      return data.json();
    })
    .then(data => {
      //rendering the main country

      renderCountry(data[0]);

      //getting its neighbours
      const neighbours = data[0].borders;

      if (neighbours.length === 0) return;

      //chaining the result to the next then
      return neighbours;
    })
    .catch(err => renderError(err.message)) // if user loses connection or error
    .then(data => {
      //looping throught the neighbours
      if (!data) {
        throw new Error(`No neighbours`);
      }

      for (let neighbour of data) {
        //calling the data for each neighbour
        fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
          .then(data => {
            return data;
          })
          .then(data => data.json())
          .then(data => {
            renderCountry(data, 'neighbour');
          });
      }
    })
    .catch(err => renderError(err.message));
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // resolve for success, reject for error, its the same in both objects
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  //check if browser has geo

  if (!navigator.geolocation) return 'Not able to run';

  try {
    //get coordinates
    const position = await getPosition();

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    //get the location based on coordinates
    const res = await fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`);
    // console.log(res);

    //check if worked
    if (!res.ok) throw new Error('Error with the API load');

    //transform to json
    const data = await res.json();

    //call the other method to complement the UI
    const country = data.country;
    // console.log(`You are in ${data.city}, ${country}`);

    getCountryAndNeighbors(country);
    return `You are in ${data.city}, ${country}`;
  } catch (err) {
    console.error(err.message);
    alert(err.message);

    //propagating the error
    throw err;
  }
};

btn.addEventListener('click', whereAmI);

//////////////////////////////////////
//next project, ASYNC and CLASS!!!!!


// const whereAmIASYNC = async function (country) {
//   //this 'await' kinda block this scope and wait for the response to continue, but dont block all the engine
//   const resp = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
//   console.log(resp);
//   console.log('hello');
// };

// console.log('bye');

// whereAmIASYNC('brazil');

// //Experiment to see the promise changing
// const reqPromise = fetch('https://restcountries.eu/rest/v2/name/brazil');
// console.log(reqPromise);
// setTimeout(function () {
//   console.log(reqPromise);
// }, 8000);
