import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import { getCountriesViaApi } from '../../utils/getCountriesViaApi';
import { ExchangeRates } from '../ExchangeRates/ExchangeRates';
import './css/Catalogue.css';
import cn from 'classnames';

interface Currency {
  code: string;
}

export interface Country {
  name: string;
  currencies: Currency[];
  alpha2Code: string;
  alpha3Code: string;
  flag: string;
  callingCodes: string[];
  borders: string[];
}

interface CatalogueState {
  countries: Country[];
  selectedCountry: string;
  isLoading: boolean;
  hideDetails: boolean;
  name: string;
  twoDigitsCountryCode: string;
  threeDigitsCountryCode: string;
  phoneCode: string;
  currency: string;
  flag: string;
  listOfCurrencies: string[];
}

export class Catalogue extends React.Component<{}, CatalogueState> {
  state = {
    countries: [],
    selectedCountry: '',
    isLoading: true,
    hideDetails: true,
    name: '',
    twoDigitsCountryCode: '',
    threeDigitsCountryCode: '',
    phoneCode: '',
    currency: '',
    flag: '',
    borders: [],
    listOfCurrencies: [],
  };

  private countries: Country[] = [];

  async componentDidMount() {
    const result = await getCountriesViaApi();
    this.countries = result as unknown as Country[];
    const countryCodeFromUrl = window.location.pathname.replace('/', '');

    this.setState({
      countries: result,
      ...this.getCountryProps(countryCodeFromUrl),
    });

    window.onpopstate = () => {
      this.setState({
        ...this.getCountryProps(countryCodeFromUrl),
      });
    };
  }

  getCountryProps(alpha2code: string | undefined): any {
    const country = this.countries.find(country => country.alpha2Code === alpha2code);

    if (!country) {
      return {
        hideDetails: true,
      };
    }

    const countryListOfCurrencies = country.currencies.map(x => x.code).filter(x => x !== "(none)" && x !== null);

    return {
      hideDetails: false,
      selectedCountry: alpha2code,
      isLoading: false,
      name: country.name,
      twoDigitsCountryCode: alpha2code,
      threeDigitsCountryCode: country.alpha3Code,
      phoneCode: country.callingCodes.join(', '),
      currency: country.currencies.filter((currency) => (
        currency.code !== "(none)" && currency.code !== null))
        .map(({code}) => code).join(', '),
      flag: country.flag,
      borders: country.borders,
      listOfCurrencies: countryListOfCurrencies,
    };
  }

  getFullCountryInfo = (e: { currentTarget: { id: any } }) => {
    const alpha2code = e.currentTarget.id;
    window.history.pushState(alpha2code, "", alpha2code);

    this.setState({
      hideDetails: false,
      ...this.getCountryProps(alpha2code),
    });
  };

  goToNeighbor = (e: any) => {
    const neighborAlpha2Code = this.countries.find(country => country.flag === e.target.src)?.alpha2Code;
    window.history.pushState(neighborAlpha2Code, "", neighborAlpha2Code);
    this.setState({
      ...this.getCountryProps(neighborAlpha2Code),
    });
  }

  renderNeighbors = () => {
    let neighborFlags = [];
    for (const countryCode of this.state.borders) {
      neighborFlags.push(((this.countries.find(country => country.alpha3Code === countryCode))?.flag));
    }

    return neighborFlags.map(flag => {
      const countryName = this.countries.find(country => country.flag === flag)?.name;
      return (
        <img
          title={countryName}
          src={flag}
          alt={"neighbor-flag"}
          className={"neighbor-flag"}
          key={flag}
          onClick={this.goToNeighbor}
        />
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
            <img alt={country.flag} src={country.flag} className={"icon-flag"}/>
            {country.name}
          </div>
        </div>
      );
    });
  };

  searchCountry = (e: any) => {
    const searchResult = this.countries.filter(country => country.name.startsWith((e.target.value.charAt(0).toUpperCase()) + e.target.value.slice(1)));
    this.setState({
      countries: searchResult,
    })
  }

  render() {
    return (
      <div className={"main"}>
        <div className={'countries-list'}>
          <DebounceInput
            debounceTimeout={300}
            type={"text"}
            className={"search"}
            placeholder={"Start typing ..."}
            onChange={this.searchCountry}
          />
          {
            (!this.state.isLoading && this.state.countries.length < 1)
              ? <p id={"no-search-results"}>No match found</p>
              : null
          }
          {this.renderCountries()}
        </div>
        <div className={"detailed-info"}>
          <div className={"empty-state"} hidden={!this.state.hideDetails}>
            <span>Select a country to see more details</span>
          </div>
          <div className={"country-details"} hidden={this.state.hideDetails}>
              <span>Name
                  <span id={"detailed-info"}>{this.state.name}</span>
              </span>
            <span>Alpha-2 country code
                  <span id={"detailed-info"}>{this.state.twoDigitsCountryCode}</span>
              </span>
            <span>Alpha-3 country code
                  <span id={"detailed-info"}>{this.state.threeDigitsCountryCode}</span>
              </span>
            <span>Phone code
                  <span id={"detailed-info"}>{this.state.phoneCode}</span>
              </span>
            <span>Currency
                  <span id={"detailed-info"}>{this.state.currency}</span>
              </span>
            <div id={"flag"}>
              <img src={this.state.flag} alt={"Official country flag"}/>
            </div>
            <span id={"neighbor-countries"}
                  style={this.state.borders.length === 0 ? {display: "none"} : {display: "block"}}>Neighbor countries</span>
            <div id={"borders"}
                 style={this.state.borders.length === 0 ? {display: "none"} : {display: "block"}}>{this.renderNeighbors()}</div>
            {
              this.state.listOfCurrencies.length ?
                <ExchangeRates listOfCurrencies={this.state.listOfCurrencies}/> : null
            }
            <span onClick={this.handleClose} id={"close-btn"}>X</span>
          </div>
        </div>
      </div>
    );
  };
}

