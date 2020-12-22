import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CountriesList } from './components/CountriesList';
import { CountryDetails } from './components/CountryDetails';
import { Provider } from 'react-redux';
import { store } from './utils/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <div className={'main'}>
        <CountriesList/>
        <CountryDetails/>
      </div>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);