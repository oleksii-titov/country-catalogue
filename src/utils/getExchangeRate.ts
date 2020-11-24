const axios = require('axios');

export const getExchangeRate = () => new Promise((resolve) => {
  const url = "https://api.exchangeratesapi.io/latest?base=USD";
  axios.get(url)
    .then(function (response: any) {
      resolve(response.data.rates);
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    })
});

