import { getLocations, getWeather } from "./weather.js";
import { debounce } from "./utils.js";

const searchInput = document.querySelector("#search-location");
searchInput.addEventListener("input", debounce(displayWeather));

async function displayWeather(event) {
	try {
		const [location] = await getLocations(event.target.value);
		const weatherData = await getWeather(location.coordinates);
		console.log(location.displayName, weatherData);
	} catch (error) {
		console.error(error);
	}
}
