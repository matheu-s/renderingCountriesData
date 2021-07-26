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

const getCountryAndNeighbors = function (country) {
  //creating the request
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(data => data.json())
    .then(data => {
      //rendering the main country
      renderCountry(data[0]);

      //getting its neighbours
      const neighbours = data[0].borders;

      if (!neighbours) return;

      //chaining the result to the next then
      return neighbours;
    })
    .then(data => {
      //looping throught the neighbours
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
    });
};

getCountryAndNeighbors('usa');

// //Experiment to see the promise changing
// const reqPromise = fetch('https://restcountries.eu/rest/v2/name/brazil');
// console.log(reqPromise);
// setTimeout(function () {
//   console.log(reqPromise);
// }, 8000);

//Lecture 248

/* Working through promises */

const req = fetch('https://restcountries.eu/rest/v2/name/brazil')
  .then(resp => resp.json()) // after the resp is delivered, we concert to JSON
  .then(resp => console.log(resp)); // after the JSON is ready, we can use
