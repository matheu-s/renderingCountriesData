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

// //Experiment to see the promise changing
// const reqPromise = fetch('https://restcountries.eu/rest/v2/name/brazil');
// console.log(reqPromise);
// setTimeout(function () {
//   console.log(reqPromise);
// }, 8000);

const whereAmI = function () {
  if (!navigator.geolocation) return 'Not able to run';

  navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://geocode.xyz/${lat},${lon}?geoit=json`;

    fetch(url)
      .then(data => {
        if (!data.ok) {
          throw new Error('Country not found');
        }
        return data.json();
      })
      .then(data => {
        let country = data.country;
        console.log(`You are in ${data.city}, ${country}`);
        getCountryAndNeighbors(country);
      })
      .catch(err => alert(err.message));
  });
};

btn.addEventListener('click', function () {
  whereAmI();
});
