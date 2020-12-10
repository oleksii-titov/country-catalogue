const axios = require('axios');

export const getExchangeRates = async (currencyCode: string) => {
  const url = `https://api.exchangeratesapi.io/latest?base=${currencyCode}`;
  const result = await axios.get(url);
  return result.data.rates;
};
