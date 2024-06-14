import { debounce } from "./utils.js";

const searchInput = document.querySelector("#search-bar");
const searchResultsList = document.querySelector(".search-results");
const searchContainer = document.querySelector("#search");

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
	}
	return listItem;
}

export function renderSearchResults(list) {
	const searchResultsItems = list.map((item) =>
		createSearchItemElement(item.text, item.handler),
	);
	searchResultsList.replaceChildren(...searchResultsItems);
}

export function renderLoader() {
	const loader = document.createElement("li");
	loader.classList.add("loader");
	loader.textContent = "●●●";
	searchResultsList.replaceChildren(loader);
}

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
	searchResultsList.classList.add("hidden");
	document.removeEventListener("click", hideListOnOutsideClick);
}

function showSearchResults() {
	searchResultsList.classList.remove("hidden");
	document.addEventListener("click", hideListOnOutsideClick);
}

function hideListOnOutsideClick(event) {
	if (!searchContainer.contains(event.target)) {
		hideSearchResults();
	}
}

searchInput.addEventListener("focus", showSearchResults);
