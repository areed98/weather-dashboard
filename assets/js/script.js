// Setting Global Variables
var cities = [];
var currentCity = "";
var cityIconEl = document.querySelector("#cityIcon");
var inputEl = document.querySelector("#formInput");
var submitEl = document.querySelector("#formSubmit");
var nameEl = document.querySelector("#cityName");
var tempEl = document.querySelector("#cityTemp");
var windEl = document.querySelector("#cityWind");
var humidityEl = document.querySelector("#cityHumidity");
var forecastEl = document.querySelector("#forecastContainer");


// Initial fetch from API (Atlanta)
fetch('https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=8a42d43f7d7dc180da5b1e51890e67dc')
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        currentCity = data.name;
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        //Functions here
        cityStats(data.current);
        forecastConstructor(data.daily);
    });


// City Search
var citySearch = function(cityName) {
    // Fetch our API using our cityName
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+ cityName +'&appid=8a42d43f7d7dc180da5b1e51890e67dc')
        .then(function (res) {
            //json parsing
            return res.json();
        })
        .then(function (data) {
            //set the name for city
            currentCity = data.name;
            //set search bar value to empty
            inputEl.value = "";
            // fetch API for longitude and latitude
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            // Call our cityStats function to set the current stats
            cityStats(data.current);
            // Call our forecastConstructor to set the daily stats
            forecastConstructor(data.daily);
        })
        .catch(function () {
            alert("Could not process!");
            cityName = "";
            inputEl.value = "";
        });

};

var cityStats = function(current) {
    // Set the date using moment.js
    cityTime = moment.unix(current.dt).format('L');
    // Set the city Icon
    cityIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+current.weather[0].icon+".png");

    // Set the stats for the city
    nameEl.textContent = currentCity + "(" + cityTime + ")";
    tempEl.textContent = "Temp: " + current.temp + " °F";
    windEl.textContent = "Wind: " + current.wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + current.humidity + "%";

};

submitEl.addEventListener("click", citySearch);