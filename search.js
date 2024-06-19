import { createLoader } from "./content.js";
import { debounce } from "./utils.js";

const searchContainer = document.querySelector("#search");
const searchInput = document.querySelector("#search-bar");
const searchResultsContainer = document.querySelector(".search-results");
const searchResultsList = document.querySelector(".search-results .results");
const preciseLocationButton = document.querySelector("#precise-location");

function createSearchItemElement(text, clickHandler = null) {
	const listItem = document.createElement("li");
	listItem.textContent = text;
	if (clickHandler) {
		listItem.classList.add("search-item");
		listItem.tabIndex = 0;
		listItem.addEventListener("click", () => {
			searchInput.value = "";
			searchResultsList.replaceChildren();
			hideSearchResults();
			clickHandler();
		});
		listItem.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				listItem.click();
			}
		});
	}
	return listItem;
}

export function renderSearchResults(list) {
	const searchResultsItems = list.map((item) =>
		createSearchItemElement(item.text, item.handler),
	);
	searchResultsList.replaceChildren(...searchResultsItems);
}

export const loader = createLoader(
	searchContainer.querySelector(".loader-container"),
);

export function handleSearchInput(onSearch) {
	const handleInputChange = (event) => {
		searchResultsList.replaceChildren();
		const { value: inputValue } = event.target;
		if (!inputValue) return;
		onSearch(inputValue);
	};
	searchInput.addEventListener("input", debounce(handleInputChange));
}

function hideSearchResults() {
	searchResultsContainer.classList.add("hidden");
	preciseLocationButton.classList.add("hidden");
	document.removeEventListener("click", hideListOnOutsideClick);
}

function showSearchResults() {
	searchResultsContainer.classList.remove("hidden");
	preciseLocationButton.classList.remove("hidden");
	document.addEventListener("click", hideListOnOutsideClick);
}

function hideListOnOutsideClick(event) {
	if (!searchContainer.contains(event.target)) {
		hideSearchResults();
	}
}

export function requestPreciseLocation(onSuccess, onError) {
	const handler = () => {
		hideSearchResults();
		navigator.geolocation.getCurrentPosition(onSuccess, onError, {
			timeout: 6000,
		});
	};
	preciseLocationButton.addEventListener("click", handler);
}

searchInput.addEventListener("focus", showSearchResults);
