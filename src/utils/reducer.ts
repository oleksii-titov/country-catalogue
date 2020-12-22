import { Action, Country } from '../../types';

export interface State {
  countriesData: Country[];
  countriesCodesList: string[];
  selectedCountryCode: string;
  isLoading: boolean;
}

const initialState = {
  countriesData: [],
  countriesCodesList: [],
  selectedCountryCode: '',
  isLoading: true,
};

export const reducer = (state: State = initialState, action: Action) => {

  switch (action.type) {

    case 'SET_COUNTRIES_DATA': {
      return {
        ...state,
        countriesData: action.payload,
        countriesCodesList: action.payload.map((country: Country) => country.alpha2Code),
        isLoading: false,
      };
    }

    case 'SELECT_COUNTRY': {
      return {
        ...state,
        selectedCountryCode: action.payload,
      };
    }

    case 'SEARCH_COUNTRY': {
      return {
        ...state,
        countriesCodesList: state.countriesData.filter(country => country.name.toLowerCase().startsWith(action.payload.toLowerCase()))
          .map(country => country.alpha2Code),
        isLoading: false,
      };
    }

    case 'RESET_SELECTED_COUNTRY': {
      return {
        ...state,
        selectedCountryCode: '',
      }
    }

    default: {
      return state;
    }

  }
}