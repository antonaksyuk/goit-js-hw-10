import { fetchCountries } from "./fetchCountries.js";
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css'

const DEBOUNCE_DELAY = 300;
const refs = {
    searchFormInput: document.getElementById('search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};


refs.searchFormInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))
let handlingQuery = ''; 

function onSearch(evt) {
    handlingQuery = evt.target.value.trim();
    clearMarkup();
        
    if (handlingQuery !== '') {
       fetchCountries(handlingQuery)
        .then(arr => {
            if (arr.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
            renderMurkup(arr);
        })
        .catch(error => fetchError(error));
} 
};

function renderMurkup(arr) {
        
    if (arr.length === 1) {
         createMurkup(arr);
         return;
    } if (arr.length >= 2 && arr.length < 10) {
         createMurkupList(arr);
         return;
   }
};

    function createMurkupList(name) {
    const markup = name.map(
        ({ name, flags }) =>
    `<li>
    <div class="country-flag-div">
    <img src="${flags.svg}" alt="${flags.alt}" width="50" height="auto">
    <p class="country-name">${name.official}</p>
    </div>
    </li>`
    )
        .join("");
        refs.countryList.innerHTML = markup;
};

function createMurkup(name) {
    const markup = name.map(
        ({ name, capital, population, flags, languages }) =>
            `<div class="country-flag-div">
            <img src="${flags.svg}" alt="${flags.alt}" width="150" height="auto">
            <h1> ${name.official}</h1>
            <ul class="country-info">
            <li> Capital: ${capital}</li>
            <li> Population: ${population}</li>
            <li> Languages: ${Object.values(languages)}</li>
            </ul>
            </div>`
        )
        .join("");
    refs.countryInfo.innerHTML = markup;
};

function clearMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

const fetchError = error => {
    Notify.failure('Oops, there is no country with that name');
    clearMarkup();
};