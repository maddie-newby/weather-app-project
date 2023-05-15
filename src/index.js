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
  let time = new Date(timestamp + timezone * 1000);
  let hours =
    time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
  let minutes =
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;

  if (hours > 23) {
    hours -= 24;
  } else if (hours < 0) {
    hours += 24;
  }

  return `${hours}:${minutes}`;
}

//date
let now = new Date();
let todaysDate = document.querySelector(".date");
let date = now.getDate();

const nth = (d) => {
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

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

function showNewIcon(event, response) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let apiKey = "d84fo7b1165495bfa04e4513f7c437tf";
  let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  if (!response) {
    axios.get(url).then((response) => {
      showNewIcon(event, response);
      return;
    });
  } else {
    document
      .querySelector("#icon")
      .setAttribute("src", response.data.condition.icon_url);
    document
      .querySelector("#icon")
      .setAttribute("alt", response.data.condition.description);
  }
}

let form = document.querySelector("form");
form.addEventListener("submit", showNewWeather);
form.addEventListener("submit", showNewWeatherImperial);
form.addEventListener("submit", showNewIcon);

function getForecast(coordinates) {
  let apiKey = "b1a8336ff1e05b64da5625e4158fbea3";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

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

  getForecast(response.data.coords);
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

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="row">
        <div class="col-2">
          <p class="five-day-details">${formatDay(forecastDay.dt)}</p>
          <p class="five-day-details">3/3</p>
        </div>
        <div class="col-2 weather-image-container">
          <img src="images/mostly-sunny.png" alt="Mostly sunny icon" />
        </div>
        <div class="col-2">
          <p class="five-day-details">${Math.round(forecastDay.temp.max)} °C</p>
          <p class="five-day-details">High</p>
        </div>
        <div class="col-2">
          <p class="five-day-details">${Math.round(forecastDay.temp.min)} °C</p>
          <p class="five-day-details">Low</p>
        </div>
        <div class="col-2">
          <p class="five-day-details">12mph</p>
          <p class="five-day-details">Wind</p>
        </div>
        <div class="col-2">
          <p class="five-day-details">${forecastDay.humidity} %</p>
          <p class="five-day-details">Humidity</p>
        </div>
      </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
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
  axios.get(url).then(showIcon);
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
    (minTemperature * 9) / 5 + 32
  );

  let temperatureUnits = document.querySelectorAll(".temperature-unit");
  temperatureUnits.forEach((unit) => {
    unit.innerHTML = "°F";
  });

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  document.querySelector(".current-weather-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector(".temp-max").innerHTML = Math.round(maxTemperature);
  document.querySelector(".temp-min").innerHTML = Math.round(minTemperature);

  let temperatureUnits = document.querySelectorAll(".temperature-unit");
  temperatureUnits.forEach((unit) => {
    unit.innerHTML = "°C";
  });

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", convertToFarhenheit);
document
  .querySelector("#celsius-link")
  .addEventListener("click", convertToCelsius);
