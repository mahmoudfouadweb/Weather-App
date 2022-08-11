'use strict';
///////////////////////////////////////////////////
// Demo 'copy me'
///////////////////////////////////////////////////
//Weather General Variables setting
const iconEl = document.querySelector('.icon');
const tempEl = document.querySelector('.temperature-value p');
const descEl = document.querySelector('.temperature-description p');
const locationEl = document.querySelector('.location p');
const notificationEl = document.querySelector('.notification');
///////////////////////////////////////////////////
//Country General Variables setting
const countryName = document.querySelector('.name p');
const neighborName = document.querySelector('.nameN p');
const population = document.querySelector('.population p');
const neighborPopulation = document.querySelector('.populationN p');
const currencies = document.querySelector('.currencies p');
const neighborCurrencies = document.querySelector('.currenciesN p');
const bordersData = document.querySelector('.borders p');
const bordersNeighbor = document.querySelector('.bordersData p');
const neighborBorders = document.querySelector('.bordersN p');
const flag = document.querySelector('.flagIcon');
const flagN = document.querySelector('.flagNIcon');
// App
const kelvin = 273.15;
const weather = {};
const countryData = {};
const neighborData = {};
weather.unit = 'C';
///////////////////////////////////////////////////
// Weather Private Key
const key = '8e7d106695f8821e7a6da4304ae71e30';
///////////////////////////////////////////////////
// check if browser support localization
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getLocalCoords, errorMessage);
} else {
  notificationEl.style.display = `block`;
  notificationEl.textContent = `Your Browser Not Support Localization `;
}
///////////////////////////////////////////////////
// get Coordinate Longitude and
function getLocalCoords(position) {
  // Get Coordinates
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  // Get Data from API
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  ///////////////////////////////////////////////////
  // Get Weather Data
  fetch(api)
    .then(res => res.json())
    .then(data => {
      weather.temperature = Math.round(data.main.temp - kelvin);
      weather.status = `${data.weather[0].main} and ${data.weather[0].description}`;
      weather.icon = data.weather[0].icon;
      weather.locationName = `${data.sys.country}, ${data.name}`;
      country(data.sys.country.toLowerCase());
      // country('sa');
    })
    .then(() => {
      updateUI();
    });
}
///////////////////////////////////////////////////
// show errors to user
function errorMessage(message) {
  console.log(message);
}
///////////////////////////////////////////////////
// country
function country(countryCode) {
  const countryApi = `https://restcountries.com/v3.1/alpha?codes=${countryCode}`;
  // console.log(countryApi);
  fetch(countryApi)
    .then(res => res.json())
    .then(data => {
      // countryUI function
      countryUI(data[0], countryData, bordersData);
      // For Development
      console.log('country', data[0]);
      return data[0];
    })
    .then(() => {
      updateUI();
    });
}
///////////////////////////////////////////////////
// Update data to UI
function updateUI() {
  // weather UI
  iconEl.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  tempEl.innerHTML = `<p>${weather.temperature}°<span>${weather.unit}</span></p> `;
  // location Link style
  locationEl.textContent = weather.locationName;
  locationEl.addEventListener(
    'mouseover',
    e => (e.target.style.color = `#3bc9db`)
  );
  locationEl.addEventListener('mouseout', e => (e.target.style.color = `#222`));
  locationEl.addEventListener('click', e => {
    document.querySelector('.country').classList.add('active');
  });
  locationEl.style.transition = `all 0.3s`;
  locationEl.style.cursor = `pointer`;
  descEl.textContent = weather.status;
  // country
  countryName.textContent = countryData.countryName;
  population.textContent = `population is: ${Math.round(
    countryData.population / 1000000
  )} Million`;
  currencies.textContent = `currency is: ${countryData.currencies}`;
  flag.src = countryData.flag;
}
///////////////////////////////////////////////////
// Update Neighbors data to UI
function neighbors(neighbors) {
  fetch(`https://restcountries.com/v3.1/alpha?codes=${neighbors}`)
    .then(res => res.json())
    .then(dataN => {
      const data = dataN[0];
      if (data.borders) {
        neighborData.countryName = `${data.name.official}, ${data.capital[0]}`;
        neighborData.population = data.population;
        neighborData.currencies = `${
          data.currencies[Object.keys(data.currencies)[0]].name
        } , ${
          data.currencies[Object.keys(data.currencies)[0]].symbol
            ? data.currencies[Object.keys(data.currencies)[0]].symbol
            : `not supported Currency`
        }`;
        neighborData.flag = data.flags.png;
        // Neighbor Borders
        neighborData.borders = data.borders;
      } else {
        neighborName.textContent = `No Neighbor's Found`;
      }
      console.log('neighbor', data);
      console.log('neighborDataObject', neighborData);
    })
    .then(() => {
      neighborCard();
    });
}
///////////////////////////////////////////////////
// Update Country Saved Date
function countryUI(data, object, borderEl) {
  object.countryName = `${data.name.official}, ${data.capital[0]}`;
  object.population = data.population;
  object.currencies = `${
    data.currencies[Object.keys(data.currencies)[0]].name
  } , ${
    data.currencies[Object.keys(data.currencies)[0]].symbol
      ? data.currencies[Object.keys(data.currencies)[0]].symbol
      : `not supported Currency`
  }`;
  object.flag = data.flags.png;
  // borders
  data.borders.forEach(border => {
    if (border) {
      const span = document.createElement('span');
      span.textContent = border.toLowerCase();
      borderEl.insertAdjacentElement('beforeend', span);
    } else {
      borderEl.textContent = 'No Neighbors Found';
    }
  });
  console.log('countryDataObject', countryData);
  // Selecting Neighbors
  borderEl.addEventListener('click', e => {
    const clicked = e.target;
    if (!clicked.classList.contains('data')) {
      // console.log('success');
      // console.log(clicked.textContent);
      document.querySelector('.neighbor').classList.remove('active');
      document.querySelector('.neighbor').classList.add('active');
      neighbors(clicked.textContent);
      neighborCard();
    }
    // neighborCard();
  });
}
///////////////////////////////////////////////////
// Update Neighbor card
function neighborCard() {
  neighborName.textContent = neighborData.countryName;
  neighborPopulation.textContent = `population is: ${Math.round(
    neighborData.population / 1000000
  )} Million`;
  neighborCurrencies.textContent = `currency is: ${neighborData.currencies}`;
  flagN.src = neighborData.flag;
  // borders
  // neighborData.borders.forEach(border => {
  //   if (border) {
  //     const span = document.createElement('span');
  //     span.textContent = border.toLowerCase();
  //     neighborBorders.insertAdjacentElement('beforeend', span);
  //   } else {
  //     neighborBorders.textContent = 'No Neighbors Found';
  //   }
  // });
}
