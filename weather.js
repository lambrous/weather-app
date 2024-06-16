import { generateUrl } from "./utils.js";

export async function getLocations(query) {
	const url = generateUrl("https://geocoding-api.open-meteo.com/v1/search", {
		count: 5,
		name: query,
	});
	const response = await fetch(url, { mode: "cors" });
	if (!response.ok) throw new Error("Failed to fetch locations.");

	const { results } = await response.json();
	if (results)
		return results.map((location) => ({
			coordinates: { lon: location.longitude, lat: location.latitude },
			displayName:
				location.name + (location.admin1 ? `, ${location.admin1}` : ""),
			country: location.country,
		}));

	throw new Error("Location not found.");
}

export async function getWeather(coordinates) {
	const url = generateUrl("https://api.open-meteo.com/v1/forecast", {
		latitude: coordinates.lat,
		longitude: coordinates.lon,
		timezone: "auto",
		forecast_hours: 8,
		current: [
			"temperature_2m",
			"apparent_temperature",
			"weather_code",
			"precipitation",
			"relative_humidity_2m",
			"wind_speed_10m",
			"is_day",
		],
		hourly: [
			"temperature_2m",
			"precipitation_probability",
			"weather_code",
			"is_day",
		],
		daily: [
			"weather_code",
			"temperature_2m_max",
			"temperature_2m_min",
			"precipitation_probability_max",
		],
	});
	const response = await fetch(url, { mode: "cors" });
	if (!response.ok) throw new Error("Failed to fetch weather data.");
	const {
		current,
		current_units: currentUnit,
		hourly,
		daily,
	} = await response.json();

	return {
		current: {
			dateTime: current.time,
			temperature: Math.round(current.temperature_2m),
			apparentTemp: `${Math.round(current.apparent_temperature)}${currentUnit.apparent_temperature}`,
			precipitation:
				current.precipitation === 0
					? "Clear"
					: `${current.precipitation}${currentUnit.precipitation}`,
			humidity: `${current.relative_humidity_2m}${currentUnit.relative_humidity_2m}`,
			wind: `${current.wind_speed_10m}${currentUnit.wind_speed_10m}`,
			weatherCode: current.weather_code,
			weatherCondition: getWeatherCondition(current.weather_code),
			isDay: !!current.is_day,
		},
		hourly: hourly.time.map((time, index) => ({
			time,
			temperature: Math.round(hourly.temperature_2m[index]),
			weatherCode: hourly.weather_code[index],
			precipitation: hourly.precipitation_probability[index],
			isDay: hourly.is_day[index],
		})),
	};
}

function getWeatherCondition(weatherCode) {
	const weatherConditions = {
		0: "Clear sky",
		1: "Mainly clear",
		2: "Partly cloudy",
		3: "Overcast",
		45: "Fog",
		48: "Depositing rime fog",
		51: "Light drizzle",
		53: "Moderate drizzle",
		55: "Dense drizzle",
		56: "Light freezing drizzle",
		57: "Dense freezing drizzle",
		61: "Slight rain",
		63: "Moderate rain",
		65: "Heavy rain",
		66: "Light freezing rain",
		67: "Heavy freezing rain",
		71: "Slight snow fall",
		73: "Moderate snow fall",
		75: "Heavy snow fall",
		77: "Snow grains",
		80: "Slight rain showers",
		81: "Moderate rain showers",
		82: "Violent rain showers",
		85: "Slight snow showers",
		86: "Heavy snow showers",
		95: "Thunderstorm",
		96: "Thunderstorm with slight hail",
		99: "Thunderstorm with heavy hail",
	};

	return weatherConditions[weatherCode];
}
