// date
let now = new Date();
let todaysDate = document.querySelector(".date");
let date = now.getDate();
const nth = function (d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let day = days[now.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];
let year = now.getFullYear();
todaysDate.innerHTML = `${day} ${date}<sup>${nth(date)}</sup> ${month} ${year}`;

// city input
function showNewWeather(event, response) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  city.innerHTML = `${city.value}`;
  let apiKey = "2d96d64425dca1d6eda00d942a281c0d";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}`;
  if (!response) {
    axios.get(url).then((response) => {
      showNewWeather(event, response);
      return;
    });
  } else {
    //city
    //todo- time alwaus shows local time
    document.querySelector(
      "h1"
    ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;

    //current weather
    document.querySelector(".current-weather-temperature").innerHTML =
      Math.round(response.data.main.temp);
    document.querySelector(".current-weather").innerHTML =
      response.data.weather[0].description.charAt(0).toUpperCase() +
      response.data.weather[0].description.slice(1);

    //max and min temp
    document.querySelector(".temp-max").innerHTML = Math.round(
      response.data.main.temp_max
    );
    document.querySelector(".temp-min").innerHTML = Math.round(
      response.data.main.temp_min
    );

    //humidity (wind speed is in impirical)
    document.querySelector(
      ".humidity"
    ).innerHTML = `${response.data.main.humidity}`;

    //sunrise and sunset
    //todo- current show in UTC rather than local time
    let sunriseTime = new Date(response.data.sys.sunrise * 1000);
    document.querySelector(".sunrise").innerHTML =
      sunriseTime.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3) +
      ":" +
      sunriseTime.toLocaleString("en-US", { minute: "numeric" });
    let sunsetTime = new Date(response.data.sys.sunset * 1000);
    document.querySelector(".sunset").innerHTML =
      sunsetTime.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3) +
      ":" +
      sunsetTime.toLocaleString("en-US", { minute: "numeric" });
    form.reset();
  }
}

function showNewWeatherImperial(event, response) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let apiKey = "2d96d64425dca1d6eda00d942a281c0d";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  if (!response) {
    axios.get(url).then((response) => {
      showNewWeatherImperial(event, response);
      return;
    });
  } else {
    document.querySelector(".wind-speed").innerHTML = Math.round(
      response.data.wind.speed
    );
    form.reset();
  }
}

let form = document.querySelector("form");
form.addEventListener("submit", showNewWeather);
form.addEventListener("submit", showNewWeatherImperial);

//weather and geolocation api work
function showWeather(response) {
  let unixLocalTime = new Date(response.data.dt * 1000);
  let sunriseTime = new Date(response.data.sys.sunrise * 1000);
  let sunsetTime = new Date(response.data.sys.sunset * 1000);

  //city and time
  document.querySelector(
    "h1"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector(".local-time").innerHTML =
    unixLocalTime.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3) +
    ":" +
    unixLocalTime.toLocaleString("en-US", { minute: "numeric" }) +
    " " +
    unixLocalTime.toLocaleString("en-US", { hour: "numeric" }).slice(-2);

  //current temp and weather description
  document.querySelector(".current-weather-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(".current-weather").innerHTML =
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1);

  //max and min temp
  document.querySelector(".temp-max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector(".temp-min").innerHTML = Math.round(
    response.data.main.temp_min
  );

  //humidity (wind speed is in imperical)
  document.querySelector(
    ".humidity"
  ).innerHTML = `${response.data.main.humidity}`;

  //sunrise and sunset
  document.querySelector(".sunrise").innerHTML =
    sunriseTime.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3) +
    ":" +
    sunriseTime.toLocaleString("en-US", { minute: "numeric" });
  document.querySelector(".sunset").innerHTML =
    sunsetTime.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3) +
    ":" +
    sunsetTime.toLocaleString("en-US", { minute: "numeric" });
}

function showWeatherImperial(response) {
  document.querySelector(".wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function onPositionRetrieveSuccessfully(position, event) {
  let apiKey = "2d96d64425dca1d6eda00d942a281c0d";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showWeather);
}

function onPositionRetrieveSpeedSuccessfully(position, event) {
  let apiKey = "2d96d64425dca1d6eda00d942a281c0d";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(url).then(showWeatherImperial);
}

retrievePosition();

//use current location link
let currentLocationLink = document.querySelector(".current-location-link");
currentLocationLink.addEventListener("click", retrievePosition);

function retrievePosition() {
  navigator.geolocation.getCurrentPosition(onPositionRetrieveSuccessfully);
  navigator.geolocation.getCurrentPosition(onPositionRetrieveSpeedSuccessfully);
}

//temperature conversion
let currentTemperature = document.querySelector(".current-weather-temperature");
let fahrenheitSelect = document.querySelector("#fahrenheit-link");
let celsiusSelect = document.querySelector("#celsius-link");
function convertToFarhenheit(event) {
  event.preventDefault();
  currentTemperature.innerHTML = `25`;
  fahrenheitSelect.style.fontWeight = "bold";
  fahrenheitSelect.style.textDecorationThickness = "3px";
  celsiusSelect.style.textDecorationThickness = "1.5px";
  celsiusSelect.style.fontWeight = "normal";
}
function convertToCelsius(event) {
  event.preventDefault();
  currentTemperature.innerHTML = `11`;
  celsiusSelect.style.fontWeight = "bold";
  celsiusSelect.style.textDecorationThickness = "3px";
  fahrenheitSelect.style.textDecorationThickness = "1.5px";
  fahrenheitSelect.style.fontWeight = "normal";
}
fahrenheitSelect.addEventListener("click", convertToFarhenheit);
celsiusSelect.addEventListener("click", convertToCelsius);
