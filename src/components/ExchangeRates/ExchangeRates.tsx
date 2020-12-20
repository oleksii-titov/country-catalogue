import React from 'react';
import { ExchangeRate } from '../ExchangeRate';

interface ExchangeRatesProps {
  listOfCurrencies: string[];
}

export class ExchangeRates extends React.Component<ExchangeRatesProps> {
  render() {
    return (
      <div className={'exchangeRates'}>
        <div id={'rates-title'}>Exchange Rates:</div>
        {
          this.props.listOfCurrencies.map(currencyCode => {
            return (
              <ExchangeRate key={currencyCode} currencyCode={currencyCode}/>
            );
          })
        }
      </div>
    );
  }
}