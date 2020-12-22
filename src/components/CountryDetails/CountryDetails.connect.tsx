import { State } from '../../utils/reducer';
import { connect } from 'react-redux';
import { CountryDetails, CountryDetailsProps } from './CountryDetails';
import { Country } from '../../../types';

const mapStateToProps = (state: State) => {

  const country: Partial<Country> = state.countriesData.find(country => country.alpha2Code === state.selectedCountryCode) || {};

  return {
    isCountrySelected: state.selectedCountryCode !== '',
    country,
    neighborCountries: country.borders?.map(neighborCountryCode => {
      const {
        name,
        alpha2Code,
        flag
      } = state.countriesData.find(country => country.alpha3Code === neighborCountryCode) || {};
      return {
        name,
        flag,
        alpha2Code,
      };
    }),
    isLoading: state.isLoading,
  };
}

const mapDispatchToProps = (dispatch: Function): Partial<CountryDetailsProps> => {

  return {
    resetSelectedCountry: () => dispatch({
      type: 'RESET_SELECTED_COUNTRY'
    }),

    setSelectedCountryCode: (alpha2Code: string) => dispatch({
      type: 'SELECT_COUNTRY',
      payload: alpha2Code,
    }),
  };
}

//@ts-ignore
export const CountryDetailsConnected = connect(mapStateToProps, mapDispatchToProps)(CountryDetails);
