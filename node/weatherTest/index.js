import {api} from './apiWeather.mjs'
const apiKey = ""; //metti qui la tua chiave
const citySelect = document.getElementById("city-select");
const weatherCards = document.getElementById("weather-cards"); //div to fill with weather cards
const form = document.getElementById("city-form"); //form to get the city
// const cities = ["Milano", "Roma", "Bologna", "Palermo", "Napoli", "Torino", "Firenze"];
//for the home exercise using Promise.all

function clearWeatherCards() {
  weatherCards.innerHTML = '';
  //removes the weather cards from the div
}

function getWeather(selectedCity, apiKey) {
  clearWeatherCards()
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&lang=it&units=metric&appid=${apiKey}`;
  console.log(url)
  //completa la funzione
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    weatherCards.innerHTML(data);
  })
  .catch(error => console.error(error));
}

//oppure: 
// async function getWeather(selectedCity, apiKey) {
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&lang=it&units=metric&appid=${apiKey}`;
//   riempi se vuoi usare invece async await
//}

form.addEventListener("submit", event => {
  event.preventDefault(); // prevents form from refreshing page
  const selectedCity = document.getElementById("city-select").value;
  getWeather(selectedCity, apiKey);
});

