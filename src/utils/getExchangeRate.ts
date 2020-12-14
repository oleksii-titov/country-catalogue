const axios = require('axios');

const cache: { [currencyCode: string]: any } = {};
export const getExchangeRates = async (currencyCode: string) => {
  if (!(currencyCode in cache)) {
    cache[currencyCode] = await axios.get(`https://api.exchangeratesapi.io/latest?base=${currencyCode}`);
  }
  return cache[currencyCode].data.rates;
};
