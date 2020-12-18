import { Country } from '../../types';

const axios = require('axios');

export const getCountriesViaApi = async () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  let result: Country[];
  const response = await axios.get(url);
  result = response.data;
  return result;
};

