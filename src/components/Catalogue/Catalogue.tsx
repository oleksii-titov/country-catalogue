import React from 'react';
import { getCountriesViaApi } from '../../utils/getCountriesViaApi';
import { getExchangeRate } from "../../utils/getExchangeRate";
import './css/Catalogue.css';
import cn from 'classnames';

interface Currency {
  code: string;
}

interface ExchangeRates {
  [currencyCode: string]: number;
}

export interface Country {
  name: string;
  currencies: Currency[];
  alpha2Code: string;
  alpha3Code: string;
  flag: string;
  callingCodes: string[];
  borders: string[];
  exchangeRates: ExchangeRates;
}

interface CatalogueState {
  countries: Country[];
  selectedCountry: string;
  hideDetails: boolean;
  name: string;
  twoDigitsCountryCode: string;
  threeDigitsCountryCode: string;
  phoneCode: string;
  currency: string;
  flag: string;
}

export class Catalogue extends React.Component<{}, CatalogueState> {
  state = {
    countries: [],
    selectedCountry: '',
    hideDetails: true,
    name: '',
    twoDigitsCountryCode: '',
    threeDigitsCountryCode: '',
    phoneCode: '',
    currency: '',
    flag: '',
    borders: [],
    exchangeRates: '',
  };

  private countries: Country[] = [];
  private exchangeRates: ExchangeRates = {};

  componentDidMount() {
    getCountriesViaApi().then((result) => {
      this.countries = result as unknown as Country[];
      const countryCodeFromUrl = window.location.pathname.replace('/', '');

      this.setState({
        countries: result,
        ...this.getCountryProps(countryCodeFromUrl),
      });
    });

    window.onpopstate = () => {
      this.setState({
        ...this.getCountryProps(window.history.state),
      });
    };
  }

  getCountryProps(alpha2code: string): any {
    const country = this.countries.find(country => country.alpha2Code === alpha2code);
    // @ts-ignore
    const primaryCurrency = country.currencies[0].code;
    let isRateAvailable = false;

    for (let key in this.exchangeRates) {
      if (key === primaryCurrency) {
        isRateAvailable = true;
      }
    }

    if (!country) {
      return {
        hideDetails: true,
      };
    }

    return {
      hideDetails: false,
      selectedCountry: alpha2code,
      name: country.name,
      twoDigitsCountryCode: alpha2code,
      threeDigitsCountryCode: country.alpha3Code,
      phoneCode: country.callingCodes.join(', '),
      currency: country.currencies.filter((currency) => (
        currency.code !== "(none)" && currency.code !== null))
        .map(({code}) => code).join(', '),
      flag: country.flag,
      borders: country.borders,
      exchangeRates: (isRateAvailable)
        ? (`USD to ${country.currencies[0].code}: ${(this.exchangeRates[primaryCurrency]).toFixed(2)}`)
        : "N/A",
    };
  }

  getFullCountryInfo = (e: { currentTarget: { id: any } }) => {
    const alpha2code = e.currentTarget.id;
    window.history.pushState(alpha2code, "", alpha2code);

    getExchangeRate().then((result) => {
      this.exchangeRates = result as ExchangeRates;
    });

    this.setState({
      ...this.getCountryProps(alpha2code),
    });
  };

  renderNeighbors = () => {
    let neighborFlags = [];
    for (const countryCode of this.state.borders) {
      neighborFlags.push(((this.countries.find(country => country.alpha3Code === countryCode))?.flag));
    }

    if (this.state.borders.length === 0) {
      return (
        <div id={"no-neighbors"}>NO NEIGHBORS FOUND</div>
      );
    }
    return neighborFlags.map(flag => {
      return (
        <img src={flag} alt={"neighbor-flag"} className={"neighbor-flag"} key={flag}/>
      );
    });
  };

  handleClose = () => {
    this.setState({
      hideDetails: true,
    });
  };

  renderCountries = () => {
    return this.state.countries.map((country: Country) => {
      return (
        <div key={country.name}>
          <div
            onClick={this.getFullCountryInfo}
            className={cn({
              'country-item': true,
              'selected': this.state.selectedCountry === country.alpha2Code,
            })}
            id={country.alpha2Code}>
            {country.name}
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className={"main"}>
        <div className={'countries-list'}>{this.renderCountries()}</div>
        <div className={"detailed-info"}>
          <div className={"empty-state"} hidden={!this.state.hideDetails}>
            <span>Select a country to see more details</span>
          </div>
          <div className={"country-details"} hidden={this.state.hideDetails}>
              <span>Name:
                  <span id={"detailed-info"}>{this.state.name}</span>
              </span>
            <span>Alpha-2 country code:
                  <span id={"detailed-info"}>{this.state.twoDigitsCountryCode}</span>
              </span>
            <span>Alpha-3 country code:
                  <span id={"detailed-info"}>{this.state.threeDigitsCountryCode}</span>
              </span>
            <span>Phone code:
                  <span id={"detailed-info"}>{this.state.phoneCode}</span>
              </span>
            <span>Currency:
                  <span id={"detailed-info"}>{this.state.currency}</span>
              </span>
            <span>Exchange rate:
                <span id={"detailed-info"}>{this.state.exchangeRates}</span>
            </span>
            <div id={"flag"}><img src={this.state.flag} alt={"Official country flag"}/></div>
            <span>Neighbor countries:</span>
            <div id={"borders"}>{this.renderNeighbors()}</div>
            <span onClick={this.handleClose} id={"close-btn"}>X</span>
          </div>
        </div>
      </div>
    );
  };
}

