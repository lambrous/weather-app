import { getLocations, getWeather } from "./weather.js";
import * as searchBar from "./search.js";

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
		text: location.displayName,
		handler() {
			showForecast(location.coordinates);
		},
	}));
}

async function showForecast(coordinates) {
	const weather = await getWeather(coordinates);
	console.log(weather);
}

searchBar.handleSearchInput(processLocationResults);
