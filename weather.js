function generateUrl(baseUrl, params) {
	const queryString = Object.entries(params)
		.map(
			([key, value]) =>
				`${key}=${Array.isArray(value) ? value.join(",") : value}`,
		)
		.join("&");
	return `${baseUrl}?${encodeURI(queryString)}`;
}

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
			displayName: `${location.name}, ${location.admin1}, ${location.country}`,
		}));

	throw new Error("Location not found.");
}

export async function getWeather(coordinates) {
	const url = generateUrl("https://api.open-meteo.com/v1/forecast", {
		latitude: coordinates.lat,
		longitude: coordinates.lon,
		current: [
			"temperature_2m",
			"weather_code",
			"precipitation",
			"relative_humidity_2m",
			"wind_speed_10m",
		],
	});
	const response = await fetch(url, { mode: "cors" });
	if (!response.ok) throw new Error("Failed to fetch weather data.");
	return response.json();
}
