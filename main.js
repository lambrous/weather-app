import {
	getAddress,
	getIpLocation,
	getLocations,
	getWeather,
} from "./weather.js";
import * as content from "./content.js";
import * as searchBar from "./search.js";
import { debounce } from "./utils.js";

let currentLocation;
let useMetric = true;

const locationFallback = {
	displayName: "Manila, Metro Manila",
	coordinates: {
		lon: 120.9822,
		lat: 14.6042,
	},
};

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

async function onGeoSuccess({ coords }) {
	const { longitude, latitude } = coords;
	const displayName = await getAddress(latitude, longitude);
	switchLocation({
		displayName,
		coordinates: { lon: longitude, lat: latitude },
	});
}

async function onGeoError() {
	try {
		const location = await getIpLocation();
		switchLocation(location);
	} catch (error) {
		console.error(error.message);
		switchLocation(locationFallback);
	}
}

async function onLoad() {
	const unit = localStorage.getItem("isMetric");
	useMetric = unit ? JSON.parse(unit) : true;
	updateTogglerStyles();

	const locationData = localStorage.getItem("location");

	if (!locationData) {
		navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
			timeout: 5000,
		});
		return;
	}
	switchLocation(JSON.parse(locationData));
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
searchBar.requestPreciseLocation(onGeoSuccess, (error) => {
	content.displayLocation("");
	content.displayError(error.message);
	console.warn(`ERROR(${error.code}): ${error.message}`);
});
document.addEventListener("DOMContentLoaded", onLoad);
