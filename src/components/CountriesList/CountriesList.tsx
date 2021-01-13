import React, { Component } from 'react';
import { Country } from '../../../types';
import { DebounceInput } from 'react-debounce-input';
import cn from 'classnames';
import { getCountriesViaApi } from '../../utils/getCountriesViaApi';
import './css/CountriesList.css'
import { updateHistoryState } from '../../utils/updateHistoryState';

export interface CountriesListProps {
  countries: Partial<Country>[];
  isLoading: boolean;
  setCountriesData: (countriesData: Country[]) => void;
  setSelectedCountryCode: (alpha2Code: string) => void;
  setSearchQuery: (searchQuery: any) => void;
  selectedCountryCode: string;
}

export class CountriesList extends Component<CountriesListProps, any> {

  handleSelectedCountryClick = (alpha2Code: string) => {
    this.props.setSelectedCountryCode(alpha2Code);
    updateHistoryState(alpha2Code);
  }

  async componentDidMount() {
    const response = await getCountriesViaApi();
    this.props.setCountriesData(response);

    const countryCodeFromUrl = window.location.pathname.replace('/', '');
    this.props.setSelectedCountryCode(countryCodeFromUrl);

    const element = document.getElementById(countryCodeFromUrl);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    window.onpopstate = () => {
      const alpha2Code = window.history.state;
      this.props.setSelectedCountryCode(alpha2Code);
    };

  }

  renderSearchInput() {
    return (
      <DebounceInput
        debounceTimeout={300}
        type={'text'}
        className={'search'}
        placeholder={'Start typing ...'}
        onChange={(e) => this.props.setSearchQuery(e.target.value)}
      />
    );
  }

  renderNoSearchResults() {
    return (
      <p id={'no-search-results'}>No match found</p>
    );
  }

  renderCountries() {
    return this.props.countries.map((country: Partial<Country>) => {
      const {
        name,
        alpha2Code,
        flag,
      } = country;

      return (
        <div key={name}>
          <div
            id={alpha2Code}
            onClick={() => this.handleSelectedCountryClick(alpha2Code as string)}
            className={cn({
              'country-item': true,
              'selected': this.props.selectedCountryCode === alpha2Code,
            })}>
            <img alt={flag} src={flag} className={'icon-flag'}/>
            {name}
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className={'flex-item-wrapper countries'}>
        <div className={'countries-list'}>
          {
            this.renderSearchInput()
          }

          {
            (!this.props.isLoading && this.props.countries.length === 0)
              ? this.renderNoSearchResults()
              : null
          }

          {
            this.renderCountries()
          }
        </div>
      </div>
    );
  }
}