import { Country } from '../../types';

const axios = require('axios');

const fetchData = async () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  let result: Country[];
  const response = await axios.get(url);
  result = response.data;
  return result;
}

export const getCountriesViaApi = async () => {
  let lastRecordDate: number = 0;

  if (window.localStorage.length === 0) {
    const response = await fetchData();
    window.localStorage.setItem('countries', JSON.stringify(response));
    lastRecordDate = Date.now();
  }
  else {
    if ((lastRecordDate - Date.now()) < 1000 * 60 * 60 * 24 * 3) {
      return JSON.parse(window.localStorage.getItem('countries') as string);
    }
    else {
      lastRecordDate = Date.now();
      const response = await fetchData();
      window.localStorage.setItem('countries', JSON.stringify(response));
    }
  }
};

