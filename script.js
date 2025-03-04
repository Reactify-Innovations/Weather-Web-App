// Declaring API Key
const API_KEY = "007ee736c797c8f01dd4c119d8f5c73b";

// ID's and Classes

// main container
const box = document.querySelector(".container");

// weather container
const myForm = document.getElementById("myForm");
const inputField = document.getElementById("inputField");
const warning = document.getElementById("text");
const weatherName = document.getElementById("weatherName");
const currentTime = document.getElementById("currentTime");
const mainIcon = document.getElementById("id");
const temperature = document.getElementById("temp");
const desc = document.getElementById("desc");
const humid = document.getElementById("humid");
const airSpeed = document.getElementById("speed");
const currentWeather = document.querySelector(".currentWeather");

// popoular Cities Container
const popularCitiesContainer = document.getElementById("popularCitiesContainer");

// forecast container
const forecastNxtDays = document.querySelector(".forecast");
const forecastBox = document.getElementById("forecastBox");
const forecastContainer = document.getElementById("forecastContainer");

// for map
let map;

// --------------------------------------------------------------------------------------------------

// Funtion Declaring

// ----------------------------------------  Default Weather with Conditions  ----------------------------------------------
// DOM Content loader 

document.addEventListener("DOMContentLoaded", () => {
  
  // Ask for location when the page loads
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showDefaultWeather);
    
  } else {
    showDefaultWeather();
  }
});

// ------------------------------------------------------------------------------------------------
// Function to show weather based on user's location

async function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    const weatherData = await getWeatherDataByCoords(lat, lon);
    displayWeatherInfo(weatherData);
    convertTimezone(weatherData);
    getWeatherIcon(weatherData);
    displayPopularCities(weatherData);
    // Fetch and display forecast data
    const forecastData = await getForecastByCoords(lat, lon);
    displayForecastInfo(forecastData);
    fetchWeatherData(forecastData);
    getLocation(weatherData);
  } catch (error) {
    console.error("Error fetching weather data for current location:", error);
  }
}

// --------------------------------------------------------------------------------------------------------
// Function to show Pakistan's weather if permission is denied or any error occurs

async function showDefaultWeather() {
  const defaultCity = "Pakistan";
  try {
    const weatherData = await getWeatherData(defaultCity);
    displayWeatherInfo(weatherData);
    convertTimezone(weatherData);
    getWeatherIcon(weatherData);
    displayPopularCities(weatherData);
    
    // Fetch and display forecast data for Pakistan's coordinates
    const forecastData = await getForecastByCoords(30.3753, 69.3451); 
    displayForecastInfo(forecastData);
    fetchWeatherData(forecastData, defaultCity);
    getLocation(weatherData, defaultCity);
  } catch (error) {
    console.error("Error fetching default weather data:", error);
  }
}

// -------------------------------  Displaying and fetching Weather Data --------------------------
// Form Event Listner and getting Weather Data

myForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = inputField.value;

  if (city) {
      try {
          const weatherData = await getWeatherData(city); // Fetch current weather data
          displayWeatherInfo(weatherData); // Display current weather information
          convertTimezone(weatherData); // Convert and display timezone info
          getWeatherIcon(weatherData); 
          await displayPopularCities(weatherData);
          

      } catch (error) {
          console.error(error);
          warning.style.display = "flex"; // Show warning for errors
      }
  } else {
      warning.style.display = "flex"; // Show warning if city input is empty
  }
});

// ---------------------------------------------------------------------------------------------------
// 2. Fetching Weather Data 

async function getWeatherData(city) {
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const response = await fetch(WEATHER_URL);
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
};

// -----------------------------------------------------------------------------------------------------
// Displaying Weather  Information 

async function displayWeatherInfo(data) {
  const {
    name: city,
    wind: { speed },
    weather: [{ description }],
    main: { temp, humidity },
    sys:{country}
  } = data;
  weatherName.textContent = city + ', ' + country;
  airSpeed.textContent = (speed * 3.6).toFixed(1) + " km/h";
  desc.textContent = description;
  temperature.textContent = Math.floor(temp - 273.15);
  humid.textContent = humidity + "%";
  warning.style.display = "none";
  return country;
}

// ---------------------------------------------------------------------------------------------------
// 4. Fetching and Displaying Real-Time  Time of searched City/Country

function convertTimezone(data) {
  const { timezone, dt } = data;
  const utcDate = new Date(dt * 1000);
  const localDate = new Date(utcDate.getTime() + timezone * 1000);
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const timeString = `${hours}:${formattedMinutes} ${meridiem}`;
  currentTime.textContent = timeString;
  return timeString;
}

// ----------------------------------------------------------------------------------------------------
//  5. Displaying Weather Icon and Changing background Image and background color by using DOM

function getWeatherIcon(data) {
  const {
    weather: [{ icon, id }],
  } = data;
  let weatherId = id;
  let iconSrc = "";
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      document.body.style.backgroundImage = "url('./IMAGES/groups/Group-200.jpg')";
      box.style.background = "hsla(217, 35%, 24%, 0.5)";
      iconSrc = "./IMAGES/ids/200.png";
      return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Thunderstorm" height="100px">`);
    case weatherId >= 300 && weatherId < 500:
      document.body.style.backgroundImage = "url('./IMAGES/groups/Group-300.jpg')";
      box.style.background = "hsla(195, 29%, 68%, 0.3)";
      iconSrc = "./IMAGES/ids/300.png";
      return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Drizzles" height="100px">`);
    case weatherId >= 500 && weatherId < 600:
      document.body.style.backgroundImage = "url('./IMAGES/groups/Group-500.jpg')";
      box.style.background = "hsla(131, 32%, 20%, 0.2)";
      iconSrc = "./IMAGES/ids/500.png";
      return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Rain" height="100px">`);
      case weatherId >= 600 && weatherId < 700:
        if(icon.endsWith("d")) {
            document.body.style.backgroundImage = "url('./IMAGES/groups/Group-600\ day.jpg')";
            box.style.background = "hsla(206, 24%, 87%, .1)";
            iconSrc = "./IMAGES/ids/600.png";
            return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
        } else {
            document.body.style.backgroundImage = "url('./IMAGES/groups/Group-600\ night.jpg')";
            box.style.background = "hsla(208, 42%, 36%, 0.3)";
            iconSrc = "./IMAGES/ids/600.png";
            return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Night" height="100px">`);
        }
    
    case weatherId >= 700 && weatherId < 799:
        if(icon.endsWith("d")) {
            document.body.style.backgroundImage = "url('./IMAGES/groups/Group-700\ day.jpg')";
            box.style.background = "hsla(240, 1%, 59%, .5)";
            iconSrc = "./IMAGES/ids/700-day.png";
            return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
        }else {
          document.body.style.backgroundImage = "url('./IMAGES/groups/Group-700\ night.jpg')";
              box.style.background = "hsla(27, 11%, 16%, 0.3)";
              
              iconSrc = "./IMAGES/ids/700-night.png";
              return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
        }
    case weatherId === 800:
      if(icon.endsWith("d")) {
          document.body.style.backgroundImage = "url('./IMAGES/groups/Group-800\ day.jpg')";
          box.style.background = "hsla(218, 80%, 27%, 0.3)";
          iconSrc = "./IMAGES/ids/800-day.png";
          return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
      }else {
        document.body.style.backgroundImage = "url('./IMAGES/groups/Group-800\ night.jpg')";
            box.style.background = "linear-gradient(180deg, hsla(223, 92%, 9%, 0.5), hsla(71, 50%, 13%, 0.4)";
            iconSrc = "./IMAGES/ids/800-night.png";
            return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
      }
    case weatherId > 800:
        if(icon.endsWith("d")) {
            document.body.style.backgroundImage = "url('./IMAGES/groups/Group-800++\ day.jpg')";
            box.style.background = "hsla(214, 61%, 59%, .3)";
            iconSrc = "./IMAGES/ids/800+day.png";
            return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
        }else {
            document.body.style.backgroundImage = "url('./IMAGES/groups/Group-800++\ night.jpg')";
            box.style.background = "hsla(214, 20%, 28%, .5)";
              iconSrc = "./IMAGES/ids/800+night.png";
              return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Clear-Day" height="100px">`);
        }
        default : 
        document.body.style.backgroundImage = "url('./IMAGES/groups/800\ day.jpg')";
            box.style.background = "balck";
        iconSrc = "./IMAGES/ids/default.png"
        return (mainIcon.innerHTML = `<img src="${iconSrc}" alt="Default" height="100px">`);
  }
}


//  -----------------------------     FORECAST      -------------------------------------
// Get Forecast data by Fethcing form the URL

async function getForecastData(city) {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
  const response = await fetch(FORECAST_URL);

  if(!response.ok) {
    throw new Error("Could not fetch data");
  }
  const data = await response.json();

  if (!data.city || !data.city.coord) {
    throw new Error("Coordinates not found in API response");
  }
  return data;
}

// ------------------------------------------------------------------------------------------------------
// Main event listener

myForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = inputField.value;
  if (city) {
    try {
      const forecast = await getForecastData(city);
      displayForecastInfo(forecast);
      getLocation(forecast.city);
      fetchWeatherData(forecast);
    } catch (error) {
      console.error(error);
    }
  } else {
    warning.style.display = "flex";
  }});

//---------------------------------------------------------------------------------------------------- 
// Didplaying Forcast Information
function displayForecastInfo(data) {
  const forecastList = data.list;

  if(!data || !data.list) {
    console.error("Forecast data is missing or undefined");
    return;
  }

  forecastBox.innerHTML = "";

  const uniqueDates = new Set();

  forecastList.forEach((forecast) => {
    const {
      dt, 
      main: {temp_min, temp_max},
      weather: [{id, icon}]
    } = forecast;
    const utcDate = new Date(dt * 1000);
    

    const dateFormat = utcDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    }).replace(',', '') + ',' + utcDate.toLocaleDateString('en-US', {weekday: 'short'});
    if (!uniqueDates.has(dateFormat)) {
      uniqueDates.add(dateFormat);
    const iconSrc = getForecastEmoji(id, icon);
    let li = document.createElement('li');
    li.innerHTML = `<div id="idTemp">
                  <div id="forecastId"><img src="${iconSrc}" alt="" height="30px"></div>
                  <div id="maxTemp">${Math.floor(temp_max - 273.15)}&#0176</div>/<div id="minTemp">${Math.floor(temp_min - 273.15)}&#0176</div>
                </div>
                <div id="date">${dateFormat}</div>`;
                forecastBox.appendChild(li);
    }        
  });
};

// ------------------------------------------------------------------------------------------------
// Function to get the forecast emoji based on the weather id and icon

function getForecastEmoji(forecastId, forecastIcon) {
  let iconSrc = "";
  switch(true) {
    case forecastId >= 200 && forecastId < 300:
      iconSrc = "./IMAGES/ids/200.png";
    break;
    case forecastId >= 300 && forecastId < 500:
      iconSrc = "./IMAGES/ids/300.png";
      break;
    case forecastId >= 500 && forecastId < 600:
      iconSrc = "./IMAGES/ids/500.png";
      break;
    case forecastId >= 600 && forecastId < 700:
      iconSrc = "./IMAGES/ids/600-day.png";
      break;
    case forecastId >= 700 && forecastId < 799:
      iconSrc = forecastIcon.endsWith('d') ? "./IMAGES/ids/700-day.png" : "./IMAGES/ids/700-night.png";
      break;
    case forecastId === 800:
      iconSrc = forecastIcon.endsWith('d') ? "./IMAGES/ids/800-day.png" : "./IMAGES/ids/800-night.png"
      break; 
    case forecastId > 800:
      iconSrc = forecastIcon.endsWith('d') ? "./IMAGES/ids/800+day.png" :  "./IMAGES/ids/800+night.png";
      break;    
    default :
        iconSrc = "./IMAGES/ids/default.png"
  }
  return iconSrc;
};


// ----------------------------------  Popular Cities   -----------------------------------------------
// Display  popular cities in the dropdown list

async function displayPopularCities(weatherData) {
  const { coord: { lat, lon },
          weather: [{description}]          
} = weatherData; 
  const popularCities = await getNearbyPopularCities(lat, lon); 
  popularCitiesContainer.innerHTML = ""; 

  const displayedCities = new Set(Array.from(popularCitiesContainer.children).map(city => city.textContent));

  popularCities.forEach(city => { 
    if (!displayedCities.has(city)) { 
      const cityElement = document.createElement("li"); 
      cityElement.innerHTML = `<div class="city-item">
                <div id="name">${city}</div> <div id="descrip">${description}</div>
              </div>`;

      cityElement.addEventListener("click", async () => { 
        const weatherData = await getWeatherData(city); 
        displayWeatherInfo(weatherData); 
        convertTimezone(weatherData);
        getWeatherIcon(weatherData); 
        getLocation(weatherData, city);
        const forecastData = await getForecastData(city);
        displayForecastInfo(forecastData);
        fetchWeatherData(forecastData, city);
      });
      popularCitiesContainer.appendChild(cityElement); 
    }
  });
}

//-------------------------------------------------------------------------------------------------------- 
// Get near by popular cities related to latitude and longitude

async function getNearbyPopularCities(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}`);
  if (!response.ok) {
    throw new Error("Could not fetch nearby cities");
  }
  const data = await response.json();
  return data.list.map(city => city.name); 
}


// -----------------------------    Location    --------------------------------
// Get location

async function getLocation(data, defaultCity, city, locationName) {
  if (!data || !data.coord) {
    console.error("Coordinates are missing or undefined in the data");
    return;
  }
  const { coord: { lat, lon } } = data;
  locationName = weatherName.textContent;
  const locaCity = city || defaultCity || locationName || inputField.value;

  if (!map) { 
    map = L.map('map').setView([lat, lon], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  } else {
    map.setView([lat, lon], 5);
  }

  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`${locaCity}`).openPopup();

  map.off('click');
  map.on('click', onMapClick);
}

// -------------------------------------------------------------------------------------------------------
// Map Click Event

async function onMapClick(e) {
  const { lat, lng } = e.latlng;
  try {
    const forecast = await getForecastByCoords(lat, lng); // Get the forecast data
    const weatherData = await getWeatherDataByCoords(lat, lng); // Get the current weather data
    const cityName = await reverseGeocode(lat, lng); // Get the city name from lat/lng
    
    // Display weather data and other details
    displayForecastInfo(forecast);
    displayWeatherInfo(weatherData);
    getWeatherIcon(weatherData);
    convertTimezone(weatherData);
    displayPopularCities(weatherData);
    
    // Set the view and show the city name in the map popup
    map.setView([lat, lng], 5);
    const popup = L.popup()
    .setLatLng([lat, lng])
      .setContent(`You clicked at ${cityName}`)
      .openOn(map);
    
      // Now fetch the weather data and update the UI, passing the city name and forecast
      fetchWeatherData(forecast, cityName);
    
  } catch (error) {
    console.error("Error fetching data for clicked location:", error);
  }
}

// ------------------------------------------------------------------------------------------------
// Get coord from the  forecast and  weather data


async function getForecastByCoords(lat, lon) {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(FORECAST_URL);
  if (!response.ok) {
    throw new Error("Could not fetch data");
  }
  const data = await response.json();
  return data;
}

async function getWeatherDataByCoords(lat, lon) {
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(WEATHER_URL);
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  const data = await response.json();
  return data;
}

// ----------------------------------------------------------------------------------------------------
// For converting the lat and lon into the city name

async function reverseGeocode(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
  if (response.ok) {
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown location';
  }
  return 'Unknown location';
}

// ----------------------------------   Weather Summary of the current day   -----------------------------------
// Fetching Weather Data

async function fetchWeatherData(data, cityName, city, defaultCity) {
  const weatherData = data.list;
  const locationName = city || cityName || defaultCity || inputField.value;
  const today = new Date().toISOString().split('T')[0];
  
  // for verifying the data that it's consoling correctly on the console
  // console.log("Complete weatherData list:", weatherData);

// this for the tomorrow's weather data
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];

  const morning = weatherData.find(item => item.dt_txt.includes(`${today} 06:00:00`)) ||
                  weatherData.find(item => item.dt_txt.includes(`${tomorrowDateString} 06:00:00`));

  const noon = weatherData.find(item => item.dt_txt.includes(`${today} 12:00:00`)) ||
  weatherData.find(item => item.dt_txt.includes(`${tomorrowDateString} 12:00:00`));

  const afternoon = weatherData.find(item => item.dt_txt.includes(`${today} 15:00:00`)) ||
  weatherData.find(item => item.dt_txt.includes(`${tomorrowDateString} 15:00:00`));

  const evening = weatherData.find(item => item.dt_txt.includes(`${today} 18:00:00`)) ||
  weatherData.find(item => item.dt_txt.includes(`${tomorrowDateString} 18:00:00`));

  const night = weatherData.find(item => item.dt_txt.includes(`${today} 21:00:00`)) ||
  weatherData.find(item => item.dt_txt.includes(`${tomorrowDateString} 00:00:00`));


//  this is for  consoling the data to the console to see the full timestamps
  console.log("Morning:", morning);  
  // console.log("Noon:", noon);
  // console.log("Afternoon:", afternoon);
  // console.log("Evening:", evening);
  // console.log("Night:", night);

  try {
      updateWeatherUI(locationName, morning, noon, afternoon, evening, night);
      inputField.value = "";
  } catch (error) {
      console.error(error);
      document.getElementById('location').textContent = 'City not found';
  }
}

// ------------------------------------------------------------------------------------------------
// For updating the weather UI

function updateWeatherUI(locationName, morning, noon, afternoon, evening, night) {
  // Location
  document.getElementById('location').textContent = locationName;

  // Morning (06:00 AM)
  if (morning && morning.main) {
    document.getElementById('morning-temp').textContent = `Temp: ${Math.floor(morning.main.temp - 273.15)}°C`;
  } else {
    document.getElementById('morning-temp').textContent = 'No data';
  }

  // Noon (12:00 PM)
  if (noon && noon.main) {
    document.getElementById('noon-temp').textContent = `Temp: ${Math.floor(noon.main.temp - 273.15)}°C`;
  } else {
    document.getElementById('noon-temp').textContent = 'No data';
  }

  // Afternoon (03:00 PM)
  if (afternoon && afternoon.main) {
    document.getElementById('afternoon-temp').textContent = `Temp: ${Math.floor(afternoon.main.temp - 273.15)}°C`;
  } else {
    document.getElementById('afternoon-temp').textContent = 'No data';
  }

  // Evening (06:00 PM)
  if (evening && evening.main) {
    document.getElementById('evening-temp').textContent = `Temp: ${Math.floor(evening.main.temp - 273.15)}°C`;
  } else {
    document.getElementById('evening-temp').textContent = 'No data';
  }

  // Night (09:00 PM or Midnight)
  if (night && night.main) {
    document.getElementById('night-temp').textContent = `Temp: ${Math.floor(night.main.temp - 273.15)}°C`;
  } else {
    document.getElementById('night-temp').textContent = 'No data';
  }
}

// --------------------------------------------  The End  ------------------------------------------------














