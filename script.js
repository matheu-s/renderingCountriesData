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

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // resolve for success, reject for error, its the same in both objects
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  //check if browser has geo
  if (!navigator.geolocation) return 'Not able to run';

  //get coordinates
  const position = await getPosition();

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  //get the location based on coordinates
  const res = await fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`);
  console.log(res);

  //check if worked
  if (!res.ok) {
    console.log(res);
    return new Error('Not found');
  }

  //transform to json
  const data = await res.json();

  //call the other method to complement the UI
  const country = data.country;
  console.log(`You are in ${data.city}, ${country}`);

  getCountryAndNeighbors(country);
};

btn.addEventListener('click', whereAmI);

/* training to create own Promise */

//Useful to store values that depends of async operations

// const myPromise = new Promise(function (resolve, reject) {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (pos) {
//       const lat = pos.coords.latitude;
//       const lon = pos.coords.longitude;

//       const cordinates = [lat, lon];

//       resolve(cordinates);
//     });
//   } else {
//     reject(new Error('Not able to run Geo'));
//   }
// });

// myPromise.then(x => console.log(x)).catch(x => console.error(x));

// //simply to pause the execution chain
// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// const imgContainer = document.querySelector('.images');

// const createImageFromAPI = function () {
//   return new Promise(function (resolve, reject) {
//     fetch('https://source.unsplash.com/1600x900/?beach')
//       .then(x => {
//         document.createElement('img');
//         let image = document.createElement('img');
//         image.src = x.url;

//         image.addEventListener('load', function () {
//           imgContainer.append(image);
//           resolve(image);
//         });

//         image.addEventListener('error', function () {
//           reject(new Error('Fail to load the image'));
//         });

//         return image.url;
//       })
//       .catch(x => console.log(x));
//   });
// };

// let currentImage;

// createImageFromAPI()
//   .then(img => {
//     currentImage = img;
//     console.log('img will disappear in 2 seconds');
//     return wait(2);
//   })
//   .then(() => {
//     currentImage.style.display = 'none';
//     return wait(3);
//   })
//   .then(() => {
//     createImageFromAPI()
//       .then(img => {
//         currentImage = img;
//         console.log('Pause for 5 seconds to admire this img ;)');
//         return wait(5);
//       })
//       .then(() => {
//         currentImage.style.display = 'none';
//         console.log('goodbye');
//       });
//   })
//   .catch(x => console.error(x + ' :('));

// //same but wihout API, just direct from folder
// const createImage = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     let image = document.createElement('img');
//     image.src = imgPath;

//     image.addEventListener('load', function () {
//       imgContainer.append(image);
//       resolve(image);
//     });

//     image.addEventListener('error', function () {
//       throw new Error(reject('Fail to load the image'));
//     });
//   });
// };

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
