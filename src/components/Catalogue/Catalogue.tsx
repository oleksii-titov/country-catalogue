import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import cn from 'classnames';
import './css/Catalogue.css';
import { getCountriesViaApi } from '../../utils/getCountriesViaApi';
import { ExchangeRates } from '../ExchangeRates/ExchangeRates';
import { Country, EventWithId } from '../../../types';
import { getCurrenciesCodesList } from '../../utils/getCurrenciesCodesList';

interface CatalogueState {
  countriesCodesList: string[];
  selectedCountryCode: string;
  isLoading: boolean;
}

export class Catalogue extends React.Component<{}, CatalogueState> {
  state = {
    countriesCodesList: [],
    selectedCountryCode: '',
    isLoading: true,
  };

  private countries: Country[] = [];

  updateUrlParam(path: string) {
    window.history.pushState(path, '', path);
  }

  getCountryByAlpha2Code(countryCode: string): Country | undefined {
    return this.countries
      .find(country => country.alpha2Code === countryCode);
  }

  getCountryByAlpha3Code(countryCode: string): Country | undefined {
    return this.countries
      .find(country => country.alpha3Code === countryCode);
  }

  async componentDidMount() {
    const response = await getCountriesViaApi();
    this.countries = response as Country[];
    const countryCodeFromUrl = window.location.pathname.replace('/', '');

    this.setState({
      countriesCodesList: this.countries.map(country => country.alpha2Code),
      selectedCountryCode: countryCodeFromUrl ? countryCodeFromUrl : '',
    });

    window.onpopstate = () => {
      const alpha2Code = window.history.state;
      this.setState({
        selectedCountryCode: alpha2Code,
      });
    };
  }

  handleCountryClick = ({currentTarget: {id: alpha2code}}: EventWithId) => {
    this.updateUrlParam(alpha2code);
    this.setState({
      selectedCountryCode: alpha2code,
    });
  };

  renderNeighbors = (borders: string[]) => {
    return borders.map((alpha3Code: string) => {
      const currentCountry = this.getCountryByAlpha3Code(alpha3Code);
      if (!currentCountry) {
        return null;
      }

      const {
        name,
        flag,
        alpha2Code,
      } = currentCountry;

      return (
        <img
          id={alpha2Code}
          title={name}
          src={flag}
          alt={'neighbor-flag'}
          className={'neighbor-flag'}
          key={flag}
          onClick={this.handleCountryClick}
        />
      );
    });
  };

  handleClose = () => {
    this.updateUrlParam('/');
    this.setState({
      selectedCountryCode: '',
    });
  };

  renderCountries = () => {
    return this.state.countriesCodesList.map((countryCode: string) => {
      const currentCountry = this.getCountryByAlpha2Code(countryCode);
      if (!currentCountry) {
        return null;
      }

      const {
        name,
        alpha2Code,
        flag,
      } = currentCountry;

      return (
        <div key={name}>
          <div
            id={alpha2Code}
            onClick={this.handleCountryClick}
            className={cn({
              'country-item': true,
              'selected': this.state.selectedCountryCode === alpha2Code,
            })}>
            <img alt={flag} src={flag} className={'icon-flag'}/>
            {name}
          </div>
        </div>
      );
    });
  };

  handleSearchInputChange = (e: any) => {
    this.setState({
      countriesCodesList: this.countries
        .filter(country => country.name.toLowerCase().startsWith(e.target.value.toLowerCase()))
        .map(country => country.alpha2Code),
      isLoading: false,
    });
  };

  renderSearchInput() {
    return (
      <DebounceInput
        debounceTimeout={300}
        type={'text'}
        className={'search'}
        placeholder={'Start typing ...'}
        onChange={this.handleSearchInputChange}
      />
    );
  }

  renderNoSearchResults() {
    return (
      <p id={'no-search-results'}>No match found</p>
    );
  }

  renderNoCountrySelected() {
    return (
      <div className={'empty-state'}>
        <span>Select a country to see more details</span>
      </div>
    );
  }

  renderSelectedCountryDetails() {
    const selectedCountry = this.getCountryByAlpha2Code(this.state.selectedCountryCode);
    if (!selectedCountry) {
      return;
    }

    const {
      name,
      alpha2Code,
      alpha3Code,
      callingCodes,
      currencies,
      flag,
      borders,
    } = selectedCountry;

    const currenciesCodesList = getCurrenciesCodesList(currencies);

    return (
      <div className={'country-details'}>
        <img className={'img-details'} src={flag} alt={'Official country flag'}/>
        <span>Name
            <span id={'detailed-info'}>{name}</span>
        </span>
        <span>Alpha-2 country code
            <span id={'detailed-info'}>{alpha2Code}</span>
        </span>
        <span>Alpha-3 country code
            <span id={'detailed-info'}>{alpha3Code}</span>
        </span>
        <span>Phone code
            <span id={'detailed-info'}>{callingCodes.join(', ')}</span>
        </span>
        <span>Currency
            <span id={'detailed-info'}>{currenciesCodesList.join(', ')}</span>
        </span>

        {
          borders.length > 0
            ? <div>
              <span id={'neighbor-countries'}>Neighbor countries</span>
              <div id={'borders'}>{this.renderNeighbors(borders)}</div>
            </div>
            : null
        }

        {
          currenciesCodesList.length
            ? <ExchangeRates listOfCurrencies={currenciesCodesList}/>
            : null
        }
        <span onClick={this.handleClose} id={'close-btn'}>X</span>
      </div>
    );
  }

  render() {
    return (
      <div className={'main'}>
        <div className={'flex-item-wrapper countries'}>
          <div className={'countries-list'}>
            {
              this.renderSearchInput()
            }

            {
              (!this.state.isLoading && this.state.countriesCodesList.length === 0)
                ? this.renderNoSearchResults()
                : null
            }

            {
              this.renderCountries()
            }

          </div>
        </div>
        <div className={'flex-item-wrapper details'}>
          <div className={'country-details-container'}>

            {
              !this.state.selectedCountryCode
                ? this.renderNoCountrySelected()
                : null
            }

            {
              this.state.selectedCountryCode
                ? this.renderSelectedCountryDetails()
                : null
            }

          </div>
        </div>
      </div>
    );
  };
}
