# Description

Application represents the list of all countries across the globe. If you want to get more details about a certain country, pick a one from the list. Or use a search input to find a desired one.

### The following country data is available:
- Name
- Flag
- Alpha2Code
- Alpha3Code
- Phone code
- Official currency
- Neighbors
- Exchange rates (official currency to USD & EUR)

Application state management is completely managed by Redux.

### API usage:

1. The list of countries with all details is fetched from [Rest Countries public API](https://restcountries.eu/).
2. Currency exchange rates are fetched from [Exchange Rates public API](https://exchangeratesapi.io/).
