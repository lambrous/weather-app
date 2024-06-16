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

export function getFormattedDateTime(dateStr, format = "long") {
	const date = new Date(dateStr);

	const dayOptions = { weekday: format };
	let timeOptions;

	if (format === "long") {
		timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
	} else {
		timeOptions = { hour: "numeric", hour12: true };
	}

	const dayOfWeek = new Intl.DateTimeFormat("en-US", dayOptions).format(date);
	const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

	return {
		dayOfWeek,
		time,
	};
}
