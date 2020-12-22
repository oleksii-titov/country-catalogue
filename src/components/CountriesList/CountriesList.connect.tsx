import { connect } from 'react-redux';
import { CountriesList, CountriesListProps } from './CountriesList';
import { State } from '../../utils/reducer';
import { Country } from '../../../types';

const mapStateToProps = (state: State): Partial<CountriesListProps> => {

  return {
    countries: state.countriesCodesList.map<Partial<Country>>((countryCode: string) => {
      const {name, alpha2Code, flag} = state.countriesData.find(country => country.alpha2Code === countryCode) || {};
      return {
        name,
        alpha2Code,
        flag,
      };
    }),
    isLoading: state.isLoading,
    selectedCountryCode: state.selectedCountryCode,
  };
}

const mapDispatchToProps = (dispatch: Function): Partial<CountriesListProps> => {

  return {
    setCountriesData: (countriesData) => dispatch({
      type: 'SET_COUNTRIES_DATA',
      payload: countriesData,
    }),
    setSelectedCountryCode: (alpha2Code: string) => dispatch({
      type: 'SELECT_COUNTRY',
      payload: alpha2Code,
    }),
    setSearchQuery: (searchQuery: string) => dispatch({
      type: 'SEARCH_COUNTRY',
      payload: searchQuery,
    })

  };
}

// @ts-ignore
export const CountriesListConnected = connect(mapStateToProps, mapDispatchToProps)(CountriesList);