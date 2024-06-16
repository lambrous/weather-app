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
			displayName: `${location.name}, ${location.admin1}`,
			country: location.country,
		}));

	throw new Error("Location not found.");
}

export async function getWeather(coordinates) {
	const url = generateUrl("https://api.open-meteo.com/v1/forecast", {
		latitude: coordinates.lat,
		longitude: coordinates.lon,
		timezone: "auto",
		current: [
			"temperature_2m",
			"apparent_temperature",
			"weather_code",
			"precipitation",
			"relative_humidity_2m",
			"wind_speed_10m",
		],
	});
	const response = await fetch(url, { mode: "cors" });
	if (!response.ok) throw new Error("Failed to fetch weather data.");
	const { current, current_units: currentUnit } = await response.json();

	return {
		current: {
			dateTime: current.time,
			temperature: Math.round(current.temperature_2m),
			apparentTemp: `${Math.round(current.apparent_temperature)}${currentUnit.apparent_temperature}`,
			precipitation: `${current.precipitation}${currentUnit.precipitation}`,
			humidity: `${current.relative_humidity_2m}${currentUnit.relative_humidity_2m}`,
			wind: `${current.wind_speed_10m}${currentUnit.wind_speed_10m}`,
			weatherCode: current.weatherCode,
		},
	};
}
