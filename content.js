import { getFormattedDateTime } from "./utils.js";

const forecastContent = document.querySelector("#forecast");
const currentDateTimeEl = document.querySelector(".weather .time");

export function hideForecast() {
	forecastContent.classList.add("hidden");
}

export function showForecast() {
	forecastContent.classList.remove("hidden");
}

export function displayLocation(location) {
	const locationEl = document.querySelector(".weather .location");
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

	const weatherIcon = document.querySelector(".current .weather-icon");
	weatherIcon.replaceChildren(
		createWeatherIcon(weather.weatherCode, weather.isDay),
	);
}

export function renderLoader() {
	const loader = createTextElement(". . . . . . .", ["loader"], "span");
	hideForecast();
	currentDateTimeEl.replaceChildren(loader);
}

export function displayError(error) {
	hideForecast();
	currentDateTimeEl.textContent = error;
}

function renderWeatherModules(containerQuery, headingText) {
	const container = document.querySelector(containerQuery);
	return (weather) => {
		const heading = createTextElement(headingText, ["heading"]);
		const weatherList = document.createElement("ul");
		weatherList.classList.add("modules");
		for (const module of weather) {
			const weatherItem = createWeatherModuleItem(module);
			weatherList.append(weatherItem);
		}
		container.replaceChildren(heading, weatherList);
	};
}

export const renderHourlyForecast = renderWeatherModules(
	"#forecast .hourly",
	"Hourly",
);

export const renderDailyForecast = renderWeatherModules(
	"#forecast .daily",
	"This Week",
);

function createWeatherModuleItem({
	weatherCode,
	temperature,
	precipitation,
	isDay,
	date,
	time,
}) {
	const weatherItem = document.createElement("li");

	const weatherIcon = createTextElement("", ["weather-icon"], "div");
	weatherIcon.replaceChildren(createWeatherIcon(weatherCode, isDay));

	const dateStr = getFormattedDateTime(date ? date : time, "short");
	const dayTimeEl = createTextElement(date ? dateStr.dayOfWeek : dateStr.time, [
		"day-time",
	]);

	const tempContainer = createTextElement("", ["temperature"], "div");
	if (Object.hasOwn(temperature, "max") && Object.hasOwn(temperature, "min")) {
		const maxTemp = createTextElement(`${temperature.max}°`, ["max"], "span");
		const minTemp = createTextElement(`${temperature.min}°`, ["min"], "span");
		tempContainer.append(maxTemp, minTemp);
	} else {
		const weatherTemperature = createTextElement(`${temperature}°`, [
			"temperature",
		]);
		tempContainer.append(weatherTemperature);
	}

	const weatherPrecipitation = createPrecipitationModuleEL(precipitation);

	weatherItem.append(
		weatherIcon,
		dayTimeEl,
		tempContainer,
		weatherPrecipitation,
	);
	return weatherItem;
}

function createPrecipitationModuleEL(value) {
	const container = createTextElement("", ["precipitation"]);
	if (!value) return container;

	const weatherPrecipitationIcon = createTextElement("", ["icon"], "span");
	const precipitationIcon = createSvgElement("svg", {
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
	});
	const precipitationSvgPath = createSvgElement("path", {
		d: "M7 .565c4.667 6.09 7 10.423 7 13a7 7 0 1 1-14 0c0-2.577 2.333-6.91 7-13",
	});
	container
		.appendChild(weatherPrecipitationIcon)
		.appendChild(precipitationIcon)
		.appendChild(precipitationSvgPath);
	const precipitationValue = createTextElement(`${value}%`, ["value"], "span");
	container.append(precipitationValue);
	return container;
}

function createWeatherIcon(weatherCode, isDay = true) {
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
	const icon = document.createElement("i");
	icon.classList.add("icon", `qi-${iconCode[weatherCode]}`);
	return icon;
}

function createSvgElement(tagName, attributes) {
	const svgNS = "http://www.w3.org/2000/svg";
	const element = document.createElementNS(svgNS, tagName);
	for (const attribute in attributes) {
		element.setAttribute(attribute, attributes[attribute]);
	}
	return element;
}

function createTextElement(text, classList = [], tagName = "p") {
	const element = document.createElement(tagName);
	if (text) element.textContent = text;
	if (classList.length) element.classList.add(...classList);
	return element;
}
