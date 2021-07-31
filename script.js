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
// Coding Challenge #3

/*
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

// let currentImg;

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// const imgContainer = document.querySelector('.images');

// const createImage = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement('img');
//     img.src = imgPath;

//     img.addEventListener('load', function () {
//       imgContainer.append(img);
//       resolve(img);
//     });

//     img.addEventListener('error', function () {
//       reject(new Error('Image not found'));
//     });
//   });
// };

// const loadAll = async function (imgArr) {
//   const imgs = await imgArr.map(img => createImage(img));
//   console.log(imgs);

//   const results = await Promise.allSettled(imgs);
//   console.log(...results);

//   const [...arrResults] = results;
//   console.log(arrResults);

//   for (let img of arrResults) {
//     console.log(img);
//     img.value.classList.value = 'parallel';

//     // img.classList.add('parallel');
//   }
// };

// loadAll(['image1.jpg', 'image2.jpg']);

// const LoadNPause = async function () {
//   try {
//     const resp = await fetch(`https://source.unsplash.com/1600x900/?beach`);

//     const img = await createImage(resp.url);
//     currentImg = img;

//     await wait(2);

//     currentImg.style.display = 'none';

//     await wait(2);

//     const resp2 = await fetch(`https://source.unsplash.com/1600x900/?beach`);
//     const img2 = await createImage(resp2.url);
//     currentImg = img2;

//     console.log('5 seconds to admire ;)');
//     await wait(5);

//     currentImg.style.display = 'none';
//   } catch (err) {
//     alert(err);
//   } finally {
//     console.log('Goodbye');
//   }
// };

// LoadNPause();

// Coding Challenge #2

/*
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image 2 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.error(err));

//
//
//
//
//
//
//

// console.log('1. Starting');
// console.log(whereAmI()); // Promise {<pending>}
// whereAmI().then(positionMsg => console.log(positionMsg)); // You are in Novo Hamburgo, Brazil -  from return in line 122
// console.log('2. Finished');

// //--------------------------------- the order is on  below
// //1. Starting
// //Promise {<pending>}
// //2. Finished
// //You are in Novo Hamburgo, Brazil

// //IIF
// (async function () {
//   try {
//     console.log('1. Starting');
//     const positionMsg = await whereAmI();
//     console.log(`2. ${positionMsg}`);
//     console.log('3. Finished');
//   } catch (err) {
//     console.log(`3. Happenned an error ${err.message}`);
//   } finally {
//     console.log('4. Thank you!');
//   }
// })();

// /* run promises in parallel */

// const get3Countries = async function (c1, c2, c3) {
//   try {
//     const data = await Promise.all([
//       getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
//     ]);

//     const capitalsArr = data.map(resp => resp[0].capital);
//     console.log(capitalsArr);
//   } catch (err) {
//     console.error(err + '🧨');
//     alert(err);
//   }
// };

// // get3Countries('brazil', 'usa', 'latvia');

// /* Promise.race() -- returns the first Promise to respond */

// const getSomeCountry = async function (c1, c2, c3) {
//   try {
//     const winner = await Promise.race([
//       getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
//     ]);

//     return `${winner[0].name} won!`;
//   } catch (err) {
//     alert(err);
//   }
// };

// getSomeCountry('italy', 'usa', 'canada');

// //in real life, sometimes we create a function to set a limit of time, and put it inside a Promise.race() with the real call
// const limitWait = function (sec) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error('It took too long ;('));
//     }, sec * 1000);
//   });
// };

// //so now, if the call takes more than the limited time, it will return error
// Promise.race([
//   getJSON(`https://restcountries.eu/rest/v2/name/brazil`),
//   limitWait(2),
// ])
//   .then(resp => console.log(resp))
//   .catch(err => console.error(err));

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
