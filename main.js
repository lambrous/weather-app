import { getIpLocation, getLocations, getWeather } from "./weather.js";
import * as content from "./content.js";
import * as searchBar from "./search.js";
import { debounce } from "./utils.js";

let currentLocation;
let useMetric = true;

async function processLocationResults(query) {
	searchBar.loader.start();
	try {
		const locations = await getLocations(query);
		const searchItems = buildSearchItems(locations);
		searchBar.renderSearchResults(searchItems);
	} catch (error) {
		searchBar.renderSearchResults([{ text: error.message }]);
	}
	searchBar.loader.stop();
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
	content.displayLocation(currentLocation.displayName);
	showForecast();
	localStorage.setItem("location", JSON.stringify(currentLocation));
}

async function showForecast(coordinates = currentLocation.coordinates) {
	content.loader.start();
	try {
		const weather = await getWeather(coordinates, useMetric);
		content.renderCurrentForecast(weather.current);

		const [, ...hourlyForecast] = weather.hourly;
		content.renderHourlyForecast(hourlyForecast);

		const [, ...dailyForecast] = weather.daily;
		content.renderDailyForecast(dailyForecast);
	} catch (error) {
		content.displayError(error.message);
		console.error(error);
	}
	content.loader.stop();
}

async function onLoad() {
	try {
		const unit = localStorage.getItem("isMetric");
		useMetric = unit ? JSON.parse(unit) : true;
		updateTogglerStyles();

		const locationData = localStorage.getItem("location");
		const location = locationData
			? JSON.parse(locationData)
			: await getIpLocation();

		switchLocation(location);
	} catch (error) {
		content.displayError(error.message);
		console.error(error);
	}
}

const unitToggler = document.querySelector(".toggle-unit");

const debounceShowForecast = debounce(() => {
	localStorage.setItem("isMetric", JSON.stringify(useMetric));
	showForecast();
}, 300);

function updateTogglerStyles() {
	const metricEl = unitToggler.querySelector(".metric");
	const imperialEl = unitToggler.querySelector(".imperial");
	metricEl.classList.toggle("active", useMetric);
	imperialEl.classList.toggle("active", !useMetric);
}

function toggleUnit() {
	useMetric = !useMetric;
	updateTogglerStyles();
	debounceShowForecast();
}

unitToggler.addEventListener("click", toggleUnit);
searchBar.handleSearchInput(processLocationResults);
document.addEventListener("DOMContentLoaded", onLoad);
