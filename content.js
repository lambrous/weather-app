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
		weatherCondition: document.querySelector(".current .condition"),
	};

	showForecast();
	for (const key in element) {
		element[key].textContent = weather[key];
	}

	const { dayOfWeek, time } = getFormattedDateTime(weather.dateTime);
	currentDateTimeEl.textContent = `${dayOfWeek} ${time}`;
	displayWeatherIcon(weather.weatherCode, weather.isDay);
}

export function renderLoader() {
	const loader = document.createElement("span");
	loader.classList.add("loader");
	loader.textContent = ". . . . . . .";

	hideForecast();
	currentDateTimeEl.replaceChildren(loader);
}

export function displayError(error) {
	hideForecast();
	currentDateTimeEl.textContent = error;
}

function displayWeatherIcon(weatherCode, isDay = true) {
	const iconCode = {
		0: isDay ? 100 : 150,
		1: isDay ? 102 : 152,
		2: isDay ? 103 : 153,
		3: 104,
		45: 501,
		48: 514,
		51: 305,
		53: 309,
		55: 307,
		56: 2214,
		57: 2214,
		61: 305,
		63: 306,
		65: 307,
		66: 313,
		67: 313,
		71: 400,
		73: 401,
		75: 402,
		77: 499,
		80: 314,
		81: 315,
		82: 316,
		85: 408,
		86: 410,
		95: 302,
		96: 304,
		99: 304,
	};
	const container = document.querySelector(".weather-icon");
	const icon = document.createElement("i");
	icon.classList.add("icon", `qi-${iconCode[weatherCode]}`);
	container.replaceChildren(icon);
}
