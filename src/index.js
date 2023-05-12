//time
function formatTime(timestamp) {
  let time = new Date(timestamp);
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatNewTime(timestamp, timezone) {
  let time = new Date(timestamp);
  let hours = time.getHours();
  let minutes = time.getMinutes();

  if (timezone % 3600 === 0) {
    hours = hours + timezone / 3600 - 1;
  } else {
    hours = hours + Math.floor(timezone / 3600) - 1;
    minutes = minutes + 30;
  }
  if (minutes >= 60) {
    hours = hours + 1;
    minutes = minutes - 60;
  }
  if (hours > 23) {
    hours = hours - 24;
  } else if (hours < 0) {
    hours = hours + 24;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

//date
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
    document.querySelector(".local-time").innerHTML = formatNewTime(
      response.data.dt * 1000,
      response.data.timezone
    );

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
    //todo- current show in city timezone rather than local time
    //sunrise and sunset
    document.querySelector(".sunrise").innerHTML = formatNewTime(
      response.data.sys.sunrise * 1000,
      response.data.timezone
    );
    document.querySelector(".sunset").innerHTML = formatNewTime(
      response.data.sys.sunset * 1000,
      response.data.timezone
    );
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
  //city and time
  document.querySelector(
    "h1"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector(".local-time").innerHTML = formatTime(
    response.data.dt * 1000
  );

  //current temp and weather description
  celsiusTemperature = response.data.main.temp;
  document.querySelector(".current-weather-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector(".current-weather").innerHTML =
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1);

  //max and min temp
  maxTemperature = response.data.main.temp_max;
  minTemperature = response.data.main.temp_min;
  document.querySelector(".temp-max").innerHTML = Math.round(maxTemperature);
  document.querySelector(".temp-min").innerHTML = Math.round(minTemperature);

  //humidity (wind speed is in imperical)
  document.querySelector(
    ".humidity"
  ).innerHTML = `${response.data.main.humidity}`;

  //sunrise and sunset
  document.querySelector(".sunrise").innerHTML = formatTime(
    response.data.sys.sunrise * 1000
  );
  document.querySelector(".sunset").innerHTML = formatTime(
    response.data.sys.sunset * 1000
  );
}

function showWeatherImperial(response) {
  document.querySelector(".wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function showIcon(response) {
  document
    .querySelector("#icon")
    .setAttribute("src", response.data.condition.icon_url);
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.condition.description);
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

function onPositionRetrieveIconSuccessfully(position, event) {
  let apiKey = "d84fo7b1165495bfa04e4513f7c437tf";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;
  axois.get(url).then(showIcon);
}

retrievePosition();

//use current location link
document
  .querySelector(".current-location-link")
  .addEventListener("click", retrievePosition);

function retrievePosition() {
  navigator.geolocation.getCurrentPosition(onPositionRetrieveSuccessfully);
  navigator.geolocation.getCurrentPosition(onPositionRetrieveSpeedSuccessfully);
  navigator.geolocation.getCurrentPosition(onPositionRetrieveIconSuccessfully);
}

//temperature conversion
let celsiusTemperature = null;
let maxTemperature = null;
let minTemperature = null;

function convertToFarhenheit(event) {
  event.preventDefault();
  document.querySelector(".current-weather-temperature").innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  document.querySelector(".temp-max").innerHTML = Math.round(
    (maxTemperature * 9) / 5 + 32
  );
  document.querySelector(".temp-min").innerHTML = Math.round(
    (maxTemperature * 9) / 5 + 32
  );
  document.querySelector(".high-temperature-unit").innerHTML = "°F";
  document.querySelector(".low-temperature-unit").innerHTML = "°F";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(
    ".current-weather-temperature"
  );
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  document.querySelector(".temp-max").innerHTML = Math.round(
    ((maxTemperature - 32) * 5) / 9
  );
  document.querySelector(".temp-min").innerHTML = Math.round(
    ((minTemperature - 32) * 5) / 9
  );
  document.querySelector(".high-temperature-unit").innerHTML = "°C";
  document.querySelector(".low-temperature-unit").innerHTML = "°C";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", convertToFarhenheit);
document
  .querySelector("#celsius-link")
  .addEventListener("click", convertToCelsius);
