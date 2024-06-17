import { getLocations, getWeather } from "./weather.js";
import * as content from "./content.js";
import * as searchBar from "./search.js";

let currentLocation;

async function processLocationResults(query) {
	searchBar.renderLoader();
	try {
		const locations = await getLocations(query);
		const searchItems = buildSearchItems(locations);
		searchBar.renderSearchResults(searchItems);
	} catch (error) {
		searchBar.renderSearchResults([{ text: error.message }]);
	}
}

function buildSearchItems(locations) {
	return locations.map((location) => ({
		text: `${location.displayName}, ${location.country}`,
		handler() {
			switchLocation(location);
		},
	}));
}

function switchLocation(location) {
	currentLocation = location;
	content.displayLocation(location.displayName);
	showForecast(currentLocation.coordinates);
}

async function showForecast(coordinates) {
	content.renderLoader();
	try {
		const weather = await getWeather(coordinates);
		content.renderCurrentForecast(weather.current);

		const [, ...hourlyForecast] = weather.hourly;
		content.renderHourlyForecast(hourlyForecast);

		const [, ...dailyForecast] = weather.daily;
		content.renderDailyForecast(dailyForecast);
	} catch (error) {
		content.displayError(error.message);
		console.error(error);
	}
}

searchBar.handleSearchInput(processLocationResults);
