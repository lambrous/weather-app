import { getLocations, getWeather } from "./weather.js";

try {
	const [location] = await getLocations("Manila");
	const weather = await getWeather(location.coordinates);
	console.log(weather);
} catch (error) {
	console.error(error);
}
