import React from "react";
import {getCountriesViaApi} from '../utils/getCountriesViaApi';

interface Currency {
    code: string;
}

interface Country {
    name: string;
    currencies: Currency[];
    alpha2Code: '';
    alpha3Code: '';
    flag: '';
    callingCodes: [];
}

export class Catalogue extends React.Component {
    state = {
        countries: [],
        selectedCountry: '',
        hideDetails: true,
        hideEmptyState: false,
        name: '',
        twoDigitsCountryCode: '',
        threeDigitsCountryCode: '',
        phoneCode: '',
        currency: '',
        flag: '',
    };

    componentDidMount() {
        getCountriesViaApi().then((result) => {
            this.setState({
                countries: result,
            })
        });
    }

    getFullCountryInfo = (e: { currentTarget: { id: any } }) => {
        const currentlySelectedCountry = e.currentTarget.id,
            moreDetails: Country = this.state.countries.find((country: Country) => {
                return country.name === currentlySelectedCountry;
            }) as unknown as Country,
            currency = moreDetails.currencies.map(({code}) => code).join(' ,'),
            alpha2code = moreDetails.alpha2Code,
            alpha3code = moreDetails.alpha3Code,
            phoneCode = moreDetails.callingCodes,
            flag = moreDetails.flag;

        this.setState({
            hideDetails: false,
            hideEmptyState: true,
            selectedCountry: currentlySelectedCountry,
            currency: currency,
            twoDigitsCountryCode: alpha2code,
            threeDigitsCountryCode: alpha3code,
            phoneCode: phoneCode,
            flag: flag,
        });
    }

    handleClose = () => {
        this.setState({
            hideDetails: true,
        })
    }

    renderCountries = () => {
        return this.state.countries.map((country: Country, key: number) => {
            return (
                <div key={country.name}>
                    <div
                        onClick={this.getFullCountryInfo}
                        className={(this.state.selectedCountry === country.name) ? "country-selected" : "country-item"}
                        id={country.name}>
                        {country.name}
                    </div>
                </div>
            );
        })
    };

    render() {
        return (
            <div className={"main"}>
                <div className={'countries-list'}>
                    {this.renderCountries()}
                </div>
                <div className={"detailed-info"}>
                    <div className={"empty-state"} hidden={!this.state.hideDetails}>
                        <span>Select a country to see more details</span>
                    </div>
                    <div className={"country-details"} hidden={this.state.hideDetails}>
                    <span>Name:
                        <span id={"detailed-info"}>
                            {this.state.selectedCountry}
                        </span>
                    </span>
                        <span>Alpha-2 country code:
                        <span id={"detailed-info"}>
                            {this.state.twoDigitsCountryCode}
                        </span>
                    </span>
                        <span>Alpha-3 country code:
                        <span id={"detailed-info"}>
                            {this.state.threeDigitsCountryCode}
                        </span>
                    </span>
                        <span>Phone code:
                        <span id={"detailed-info"}>
                            {this.state.phoneCode}
                        </span>
                    </span>
                        <span>Currency:
                        <span id={"detailed-info"}>
                            {this.state.currency}
                        </span>
                    </span>
                        <div id={"flag"}>
                            <img src={this.state.flag} alt={"Official country flag"}/>
                        </div>
                        <span onClick={this.handleClose} id={"close-btn"}>
                        X
                    </span>
                    </div>
                </div>
            </div>
        );
    }
}
