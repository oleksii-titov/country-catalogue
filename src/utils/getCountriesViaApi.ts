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
  const lastRecordDateString = window.localStorage.getItem('lastRecordDate');
  if (lastRecordDateString) {
    const lastRecordDate = parseInt(lastRecordDateString);
    if (Date.now() - lastRecordDate <= 86400 * 3) {
      const countriesData = window.localStorage.getItem('countriesData');
      if (countriesData) {
        try {
          return JSON.parse(countriesData);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
  const data = await fetchData();
  window.localStorage.setItem('lastRecordDate', String(Date.now()));
  window.localStorage.setItem('countriesData', JSON.stringify(data));
  return data;
};

