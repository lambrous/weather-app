export function generateUrl(baseUrl, params) {
	const queryString = Object.entries(params)
		.map(
			([key, value]) =>
				`${key}=${Array.isArray(value) ? value.join(",") : value}`,
		)
		.join("&");
	return `${baseUrl}?${encodeURI(queryString)}`;
}

export function debounce(func, delay = 500) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
