//Import modules
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// openweathermap.org API Key and URL
const openweatherApiKey = process.env.OPENWEATHER_API_KEY;
const openweatherApiUrl = 'https://api.openweathermap.org/data/2.5/';

// unsplash.com API Key and URL
const unsplashApiKey = process.env.UNSPLASH_API_KEY;
const unsplashApiUrl = 'https://api.unsplash.com/search/photos';

// Endpoint to fetch current weather data for a specific city
app.post('/getWeatherData', (req, res) => {
  
  // Function to convert Celsius to Fahrenheit
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  // Function to convert a string to camel case
  function toCamelCase(input) {
    return input.toLowerCase().replace(/(^\w|\s\w)/g, function (match) {
      return match.toUpperCase();
    });
  }

  // Construct the OpenWeatherMap API URL for current weather
  const weatherUrl = `${openweatherApiUrl}weather?q=${req.body.city}&units=metric&appid=${openweatherApiKey}`;
  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      // Send processed weather data in response
      res.status(200).json({
        temperatureInCelsius: data.main.temp,
        temperatureInFahrenheit: celsiusToFahrenheit(data.main.temp),
        city: data.name,
        state: data.sys.country,
        description: toCamelCase(data.weather[0].description),
      });
    })
    .catch(error => {
      // Handle errors and send error response
      console.error('Error fetching weather data: ', error);
      res.status(500).json({ error: 'Error fetching weather data' });
    });
});

// Function to fetch city-related images
app.post('/fetchCityPhotos', (req, res) => {
  // Construct the Unsplash API URL for city-related images
  const unsplashUrl = `${unsplashApiUrl}?query=${req.body.city}&client_id=${unsplashApiKey}`;

  // Fetch images from Unsplash
  fetch(unsplashUrl)
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      // Handle errors and send error response
      console.error('Error fetching photos: ', error);
      res.status(500).json({ error: 'Error fetching photos' });
    });
});

// Endpoint to fetch 5-day weather forecast for a specific city
app.post('/getWeatherForecast', (req, res) => {

  // Construct the OpenWeatherMap API URL for 5-day forecast
  const forecastUrl = `${openweatherApiUrl}forecast?q=${req.body.city}&units=metric&appid=${openweatherApiKey}`;

  // Fetch forecast data from OpenWeatherMap
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      // Send forecast data in response
      res.json(data);
    })
    .catch(error => {
      console.error('Error fetching forecast data: ', error);
      res.status(500).json({ error: 'Error fetching forecast data' });
    });
});

// Start Express server and listen on specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});