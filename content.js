import { getFormattedDateTime } from "./utils.js";

const forecastContent = document.querySelector("#forecast");
const currentDateTimeEl = document.querySelector(".current .time");

export function hideForecast() {
	forecastContent.classList.add("hidden");
}

export function showForecast() {
	forecastContent.classList.remove("hidden");
}

export function displayLocation(location) {
	const locationEl = document.querySelector(".current .location");
	locationEl.textContent = location;
}

export function renderCurrentForecast(weather) {
	const element = {
		temperature: document.querySelector(".current .temperature .value"),
		apparentTemp: document.querySelector(".current .apparent .value"),
		precipitation: document.querySelector(".current .precipitation .value"),
		humidity: document.querySelector(".current .humidity .value"),
		wind: document.querySelector(".current .wind .value"),
	};

	showForecast();
	for (const key in element) {
		element[key].textContent = weather[key];
	}

	const { dayOfWeek, time } = getFormattedDateTime(weather.dateTime);
	currentDateTimeEl.textContent = `${dayOfWeek} ${time}`;
}
