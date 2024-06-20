# Minimal Weather App

Welcome to my Weather App! This project is a part of [The Odin Project's JavaScript course](https://www.theodinproject.com/lessons/node-path-javascript-weather-app). The app provides current weather information and forecasts based on the user's location or a specified location.

## Features

- **Current Weather:** Get the current weather information for your location or any city worldwide.
- **Hourly Forecast:** Check the hourly weather forecast for more detailed information.
- **Daily Forecast:** See an extended daily weather forecast.
- **Precise Location Feature:** Allows for more accurate location detection.
- **Temperature Unit Toggle:** Easily switch between Celsius and Fahrenheit units, with improved accessibility for the toggle button.
- **Theme Switching:** Automatically switch between day and night themes based on the user's location.

## APIs Used

- **[Open-Meteo](https://open-meteo.com/):** For fetching weather forecasts and geocoding.
- **[GeoJS](https://www.geojs.io/):** For IP geolocation lookup to detect user location.
- **[Nominatim](https://nominatim.org/):** For converting coordinates to addresses.

## Resources

- **[QWeather Icons](https://icons.qweather.com/en/):** Used for displaying weather icons to represent different weather conditions visually.

## What I Learned

Creating this Weather App has been a valuable learning experience. Here are some key concepts and skills I have developed:

### Asynchronous Code

- **Understanding Asynchronous JavaScript:** Learned how asynchronous operations work in JavaScript, which is crucial for making API calls and handling responses without blocking the main thread.

### APIs

- **What is an API:** Learned the fundamental concepts of APIs (Application Programming Interfaces), including how they allow different software systems to communicate with each other.
- **Making API Calls:** Mastered the technique of making HTTP requests to APIs using `fetch()` and handling the responses effectively.

### Async and Await

- **Async Functions:** Discovered the syntax and use cases for `async` functions, which allow writing asynchronous code in a more synchronous manner.
- **Await Keyword:** Understood how the `await` keyword works to pause the execution of an `async` function until a promise is resolved, making the code easier to read and manage.

### Frontend Skills

- **DOM Manipulation:** Enhanced my skills in manipulating the DOM (Document Object Model) to dynamically display weather data based on API responses.
- **Event Handling:** Implemented various event listeners to capture user actions like submitting a city name for weather lookup.
