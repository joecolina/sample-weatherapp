// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

// Function to convert a string to camel case
function toCamelCase(input) {
  return input.toLowerCase().replace(/(^\w|\s\w)/g, function (match) {
      return match.toUpperCase();
  });
}

// Function to fetch city images - made it asynchronous
async function fetchCityPhotos(city) {
  try {
      // Send POST request to fetch city images
      const response = await fetch('/fetchCityPhotos', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              city: city,
          }),
      });

      // Parse response data as JSON
      const data = await response.json();

      // Clear previous images in photo-container
      const photoContainer = document.getElementById('photo-container');
      // Clear previous images after query
      photoContainer.innerHTML = '';

      if (data.results.length > 0) {
          // Display up to three images
          for (let i = 0; i < Math.min(3, data.results.length); i++) {
              const photoUrl = data.results[i].urls.regular;
              const photoElement = document.createElement('img');
              photoElement.src = photoUrl;
              photoContainer.appendChild(photoElement);
          }
      } else {
          // Display message when no images are available
          const noPhotosText = document.createElement('p');
          noPhotosText.textContent = 'No photos available';
          photoContainer.appendChild(noPhotosText);
      }
  } catch (error) {
      console.error(error);
  }
}

// Function to get current weather data
async function getWeatherData(city) {
  try {
      // Sends POST request to /getWeatherData endpoint
      const response = await fetch('/getWeatherData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              city: city,
          }),
      });

      // Parse response data as JSON
      const data = await response.json();
      // Calls function to update UI with new weather data
      updateWeatherUI(data);
  } catch (error) {
      console.error('Error fetching weather data:', error);
  }
}

// Function to update UI with weather data
function updateWeatherUI(data) {
  // Update elements with new data
  let locationElement = document.getElementById('location');
  let cityElement = document.getElementById('city');
  let stateElement = document.getElementById('state');
  let temperatureElement = document.getElementById('temperature');
  let descriptionElement = document.getElementById('description');

  locationElement.textContent = 'Weather in';
  cityElement.textContent = data.city;
  stateElement.textContent = `(${data.state})`;
  temperatureElement.textContent = `${Math.round(data.temperatureInFahrenheit)}°F`;
  descriptionElement.textContent = data.description;
}

//Function to get weather forecast data
async function getWeatherForecast(city) {
  try {
      // Sends POST request to /getWeatherForecast endpoint
      const response = await fetch('/getWeatherForecast', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              city: city,
          }),
      });

      // Parse response data as JSON
      const data = await response.json();
      // Calls function to update UI with new forecast data
      updateForecastUI(data);
  } catch (error) {
      console.error('Error fetching weather forecast:', error);
  }
}

// Function to update the UI with forecast data
function updateForecastUI(data) {
  const forecastList = document.getElementById('forecast-list');
  // Clears previous forecast after query
  forecastList.innerHTML = '';

  for (let i = 0; i < data.list.length; i += 8) {
      let date = new Date(data.list[i].dt * 1000);
      //Get temp in C
      let temperatureInCelsius = data.list[i].main.temp;
      //Convert temp to F using CelsiusToFarentheit
      let temperatureInFahrenheit = celsiusToFahrenheit(temperatureInCelsius);
      //Convert weather to description to Camel Case using toCamelCase
      let description = toCamelCase(data.list[i].weather[0].description);
      let listItem = document.createElement('li');
      // List item formatting to display element correctly
      listItem.textContent = `${date.toDateString()}: ${Math.round(temperatureInFahrenheit)}°F, ${description}`;
      forecastList.appendChild(listItem);
  }
}

// Handle user input and fetch weather data and images on button click and Enter key press
const getWeatherButton = document.getElementById('get-weather-button');
const cityInput = document.getElementById('city-input');

//These event listeners are for both, button click or Enter key press.
getWeatherButton.addEventListener('click', () => {
  const city = cityInput.value;
  // Fetch current weather & forecast data, city images for button click input
  getWeatherData(city);
  getWeatherForecast(city);
  fetchCityPhotos(city);
});

cityInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
      const city = cityInput.value;
      // Fetch current weather & forecast data, city images for Enter key input
      getWeatherData(city);
      getWeatherForecast(city);
      fetchCityPhotos(city);
      // Clears input box after query
      cityInput.value = '';
  }
});

// Update weather data and forecast when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Replace with any default city
  const defaultCity = 'Atlanta'; 
  fetch('/getWeatherData', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          city: defaultCity,
      }),
  })
      .then((response) => response.json())
      .then((data) => {
          let locationElement = document.getElementById('location');
          let cityElement = document.getElementById('city');
          let stateElement = document.getElementById('state');
          let temperatureElement = document.getElementById('temperature');
          let descriptionElement = document.getElementById('description');

          locationElement.textContent = 'Weather in';
          cityElement.textContent = data.city;
          stateElement.textContent = `(${data.state})`;
          temperatureElement.textContent = `${Math.round(data.temperatureInFahrenheit)}°F`;
          descriptionElement.textContent = data.description;
      })
      .catch(error => {
          console.error('Error fetching weather data from server:', error);
      });

  await fetch('/getWeatherForecast', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          city: defaultCity,
      }),
  })
      .then((response) => response.json())
      .then((data) => {
          const forecastList = document.getElementById('forecast-list');

          forecastList.innerHTML = '';

          for (let i = 0; i < data.list.length; i += 8) {
              let date = new Date(data.list[i].dt * 1000);
              let temperatureInCelsius = data.list[i].main.temp;
              let temperatureInFahrenheit = celsiusToFahrenheit(temperatureInCelsius);
              let description = toCamelCase(data.list[i].weather[0].description);

              let listItem = document.createElement('li');
              listItem.textContent = `${date.toDateString()}: ${Math.round(temperatureInFahrenheit)}°F, ${description}`;
              forecastList.appendChild(listItem);
          }
      })
      .catch((error) => {
          console.error(error);
      });

  await fetchCityPhotos(defaultCity);

});