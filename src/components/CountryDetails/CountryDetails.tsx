import React, { Component } from 'react';
import { getCurrenciesCodesList } from '../../utils/getCurrenciesCodesList';
import { ExchangeRates } from '../ExchangeRates/ExchangeRates';
import { Country } from '../../../types';
import './css/CountryDetails.css'
import { updateHistoryState } from '../../utils/updateHistoryState';

export interface CountryDetailsProps {
  country: Country;
  neighborCountries: Partial<Country>[];
  isCountrySelected: boolean;
  isLoading: boolean;
  resetSelectedCountry: () => void;
  setSelectedCountryCode: (alpha2Code: string) => void;
}

export class CountryDetails extends Component<CountryDetailsProps, any> {

  handleCloseButtonClick = () => {
    this.props.resetSelectedCountry();
  }

  handleNeighborCountryClick = (alpha2Code: string) => {
    updateHistoryState(alpha2Code);
    this.props.setSelectedCountryCode(alpha2Code);

    const element = document.getElementById(alpha2Code);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  renderNoCountrySelected() {
    return (
      <div className={'empty-state'}>
        <span>Select a country to see more details</span>
      </div>
    );
  }

  renderNeighbors = () => {
    return this.props.neighborCountries.map((neighborCountry: Partial<Country>) => {
      const {
        name,
        flag,
        alpha2Code,
      } = neighborCountry;

      return (
        <img
          id={alpha2Code}
          title={name}
          src={flag}
          alt={'neighbor-flag'}
          className={'neighbor-flag'}
          key={flag}
          onClick={() => this.handleNeighborCountryClick(alpha2Code as string)}
        />
      );
    });
  };

  renderSelectedCountryDetails() {
    const {
      name,
      alpha2Code,
      alpha3Code,
      callingCodes,
      currencies,
      flag,
      borders,
    } = this.props.country;

    const currenciesCodesList = getCurrenciesCodesList(currencies);

    return (
      <div className={'country-details'}>
        <img className={'img-details'} src={flag} alt={'Official country flag'}/>
        <span>Name:
            <span id={'detailed-info'}>{name}</span>
        </span>
        <span>Alpha-2 country code:
            <span id={'detailed-info'}>{alpha2Code}</span>
        </span>
        <span>Alpha-3 country code:
            <span id={'detailed-info'}>{alpha3Code}</span>
        </span>
        <span>Phone code:
            <span id={'detailed-info'}>{callingCodes.join(', ')}</span>
        </span>
        <span>Currency:
            <span id={'detailed-info'}>{currenciesCodesList.join(', ')}</span>
        </span>

        {
          borders.length > 0
            ? <div>
              <span id={'neighbor-countries'}>Neighbor countries:</span>
              <div id={'borders'}>{this.renderNeighbors()}</div>
            </div>
            : null
        }

        {
          currenciesCodesList.length
            ? <ExchangeRates listOfCurrencies={currenciesCodesList}/>
            : null
        }
        <span onClick={this.handleCloseButtonClick} id={'close-btn'}>X</span>
      </div>
    );
  }

  render() {
    return (
      <div className={'flex-item-wrapper details'}>
        <div className={'country-details-container'}>

          {
            !this.props.isCountrySelected
              ? this.renderNoCountrySelected()
              : null
          }

          {
            (this.props.isCountrySelected && !this.props.isLoading)
              ? this.renderSelectedCountryDetails()
              : null
          }
        </div>
      </div>
    );
  }
}