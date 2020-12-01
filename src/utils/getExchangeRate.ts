const axios = require('axios');

export const getExchangeRates = async () => {
  const url = "https://api.exchangeratesapi.io/latest?base=USD";
  const result = await axios.get(url);
  return result.data.rates;
};

