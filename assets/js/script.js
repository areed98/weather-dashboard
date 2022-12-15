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
var historyEl = document.querySelector("#historyContainer");
var dataContainerEl = document.querySelector("#dataContainer");
var searchContainerEl = document.querySelector("#searchContainer");
var clearEl = document.querySelector("#clearHistory");

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
    var cityURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=8a42d43f7d7dc180da5b1e51890e67dc";
    fetch(cityURL)
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

            // Delete our forecast container and recreate before calling function.
            forecastEl.remove();
            var forecastContainerEl = document.createElement("div");
            forecastContainerEl.classList.add("d-flex");
            forecastContainerEl.setAttribute("id", "forecastContainer");
            dataContainerEl.appendChild(forecastContainerEl);
            // Call our forecastConstructor to set the daily stats
            forecastConstructor(data.daily);

            var cityList = {
                name: currentCity
            }

            cities.unshift(cityList);

            saveCities();
            historyConstructor();
            historyContainerConstructor();
        })
        .catch(function () {
            alert("Could not process!");
            currentCity = "";
            inputEl.value = "";
        });

};

// Search logic
var citySearchInput = function(event) {

    // Prevent default of reloading page
    event.preventDefault();

    var city = inputEl.value;

    if (city === null || city === "") {
        alert("Please input text for your search");
    } else {
        citySearch(city);
    }
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

// 5 Day forecast function
var forecastConstructor = function(daily) {

    //Set the container
    forecastEl = document.querySelector("#forecastContainer");

    //loop 5 times
    for (n=1; n<6; n++) {
        // Set our time(s) again
        var day = daily[n].dt;
        var forecastTime = moment.unix(day).format('L');

        // Create elements for each day
        var imgEl = document.createElement("img");
        var squareEl = document.createElement("div");
        var divEl = document.createElement("div");
        var h2El = document.createElement("h2");

        // Add classes
        squareEl.classList.add("forecastSquare");
        squareEl.classList.add("col");
        divEl.classList.add("p-3");
        h2El.setAttribute("id", "day-" + n);
        imgEl.setAttribute("src", "http://openweathermap.org/img/wn/"+daily[n].weather[0].icon+".png")
        // set our time
        h2El.textContent = forecastTime;
        //append children
        divEl.appendChild(h2El);
        divEl.appendChild(imgEl);
        //create our info elements
        var pEl = document.createElement("p");
        var p2El = document.createElement("p");
        var p3El = document.createElement("p");
        //fill info elements
        pEl.textContent = "Temp: " + daily[n].temp.day + "°F";
        p2El.textContent = "Wind: " + daily[n].wind_speed + " MPH";
        p3El.textContent = "Humidity: " + daily[n].humidity + " %";
        //append info elements
        divEl.appendChild(pEl);
        divEl.appendChild(p2El);
        divEl.appendChild(p3El);
        //append all
        squareEl.appendChild(divEl);
        forecastEl.appendChild(squareEl);
    }

};

//history container constructor
var historyContainerConstructor = function() {
    historyEl.remove()
    var newHistoryEl = document.createElement("div");
    newHistoryEl.setAttribute("id", "historyContainer");
    searchContainerEl.appendChild(newHistoryEl);
};

//save cities function
var saveCities = function() {
    //stringify our array and save it.
    localStorage.setItem("citiesKey", JSON.stringify(cities));
};

//load cities function
var loadCities = function() {
    //parse our cities
    var savedCities = JSON.parse(localStorage.getItem("citiesKey"));

    //return false if there are no cities.
    if (!savedCities) {
        return false;
    } else {
        cities = savedCities;
        historyConstructor();
    }
};

//city history logic
var historyConstructor = function() {

    historyEl = document.querySelector("#historyContainer");

    for (i=0; i < cities.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.classList.add("btn");
        buttonEl.classList.add("btns");
        buttonEl.classList.add("btn-secondary");
        buttonEl.classList.add("text-dark");
        buttonEl.textContent = cities[i].name;
        buttonEl.addEventListener("click", historyButtonConstruct);

        historyEl.appendChild(buttonEl);
    }
};

//add ability to click history buttons
var historyButtonConstruct = function(event) {
    var button = event.target;

    var buttonText = button.textContent;

    citySearch(buttonText);
};

//add clear button
var clearHistory = function() {
    //clear our cities array
    cities = [];
    //run our functions to load back a clear state
    saveCities();
    loadCities();
    historyContainerConstructor();
}

//load cities on page load
loadCities();

//event listeners
submitEl.addEventListener("click", citySearchInput);
clearEl.addEventListener("click", clearHistory);