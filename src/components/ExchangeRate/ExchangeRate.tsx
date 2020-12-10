import React, { Component } from 'react';
import { getExchangeRates } from '../../utils/getExchangeRate'
import '../ExchangeRate/css/ExchangeRate.css'

interface Rates {
  [currencyCode: string]: number;
}

interface ExchangeRateProps {
  currencyCode: string;
}

interface ExchangeRateState {
  isLoading: boolean;
  isBadRequest: boolean;
  rates: Rates;
}

export class ExchangeRate extends Component<ExchangeRateProps, ExchangeRateState> {
  state = {
    isLoading: true,
    isBadRequest: false,
    rates: {
      USD: 0,
      EUR: 0,
    },
  }

  async fetchExchangeRates() {
    try {
      const response = await getExchangeRates(this.props.currencyCode);
      this.setState({isLoading: false, rates: response});
    } catch (e) {
      this.setState({isLoading: false, isBadRequest: true});
    }
  }

  async componentDidMount() {
    await this.fetchExchangeRates();
  }

  render() {
    return (
      <div className={"rate-per-currency"}>
        <div id={"currency-name"}>{this.props.currencyCode}</div>
        {
          this.state.isLoading
            ? <div className="loader"/>
            : null
        }
        {
          this.state.isBadRequest
            ? <span id={"error"}>No exchange rates found</span>
            : null
        }
        {
          (!this.state.isLoading && !this.state.isBadRequest)
            ? <span id={"rate-value"}>
              {
                'USD' in this.state.rates
                  ? <span id={"USD"}>USD: {this.state.rates["USD"].toFixed(2)}</span>
                  : null
              }
              {
                'EUR' in this.state.rates
                  ? <span id={"EUR"}>EUR: {this.state.rates["EUR"].toFixed(2)}</span>
                  : null
              }
              {
                (!('USD' in this.state.rates) && !('EUR' in this.state.rates))
                  ? <span>No USD and EUR were found.</span>
                  : null
              }
              </span>
            : null
        }
      </div>
    )
  }
}
