import React from 'react';
import {getCountriesViaApi} from '../../utils/getCountriesViaApi';
import '../Catalogue/css/Catalogue.css';
import cn from 'classnames';

interface Currency {
    code: string;
}

interface CallingCodes {
    callingCodes: string;
}

export interface Country {
    name: string;
    currencies: Currency[];
    alpha2Code: string;
    alpha3Code: string;
    flag: string;
    callingCodes: CallingCodes[];
}

// TODO to describe an interface for a state
/*interface CatalogueState {
    countries: Country[],
    selectedCountry: string,
    hideDetails: boolean,
    name: string,
    twoDigitsCountryCode: string,
    threeDigitsCountryCode: string,
    phoneCode: CallingCodes[],
    currency: Currency[],
    flag: string,
}*/

export class Catalogue extends React.Component {
    state = {
        countries: [],
        selectedCountry: '',
        hideDetails: true,
        name: '',
        twoDigitsCountryCode: '',
        threeDigitsCountryCode: '',
        phoneCode: '',
        currency: '',
        flag: '',
    };

    private countries: Country[] = [];

    componentDidMount() {
        getCountriesViaApi().then((result) => {
            this.countries = result as unknown as Country[];
            const countryCodeFromUrl = window.location.pathname.replace('/', '');

            this.setState({
                countries: result,
                hideDetails: false,
                ...this.getCountryProps(countryCodeFromUrl),
            });
        });

        //TODO: implement using react-router
        /*window.onpopstate = (e:any) => {
            e.preventDefault();
                this.setState({
                    hideDetails: false,
                    ...this.getCountryProps(window.history.state),
                });
        };*/
    }

    getCountryProps(alpha2code: string): any {
        const country = this.countries.find(country => country.alpha2Code === alpha2code);
        if (!country) {
            return {
                hideDetails: true,
            };
        }
        return {
            selectedCountry: alpha2code,
            name: country.name,
            twoDigitsCountryCode: alpha2code,
            threeDigitsCountryCode: country.alpha3Code,
            phoneCode: country.callingCodes.join(', '),
            currency: country.currencies.filter((element) => element.code !== "(none)").map(({code}) => code).join(', '),
            flag: country.flag,
        };
    }

    getFullCountryInfo = (e: { currentTarget: { id: any } }) => {
        const alpha2code = e.currentTarget.id;
        window.history.replaceState(alpha2code, "", alpha2code);

        this.setState({
            hideDetails: false,
            ...this.getCountryProps(alpha2code),
        });
    };

    handleClose = () => {
        this.setState({
            hideDetails: true,
        });
    };

    renderCountries = () => {
        return this.state.countries.map((country: Country) => {
            return (
                <div key={country.name}>
                    <div
                        onClick={this.getFullCountryInfo}
                        className={cn({
                            'country-item': true,
                            'selected': this.state.selectedCountry === country.alpha2Code,
                        })}
                        id={country.alpha2Code}>
                        {country.name}
                    </div>
                </div>
            );
        });
    };

    render() {
        return (
            <div className={"main"}>
                <div className={'countries-list'}>{this.renderCountries()}</div>
                <div className={"detailed-info"}>
                    <div className={"empty-state"} hidden={!this.state.hideDetails}>
                        <span>Select a country to see more details</span>
                    </div>
                    <div className={"country-details"} hidden={this.state.hideDetails}>
                        <span>Name:
                            <span id={"detailed-info"}>{this.state.name}</span>
                        </span>
                        <span>Alpha-2 country code:
                            <span id={"detailed-info"}>{this.state.twoDigitsCountryCode}</span>
                        </span>
                        <span>Alpha-3 country code:
                            <span id={"detailed-info"}>{this.state.threeDigitsCountryCode}</span>
                        </span>
                        <span>Phone code:
                            <span id={"detailed-info"}>{this.state.phoneCode}</span>
                        </span>
                        <span>Currency:
                            <span id={"detailed-info"}>{this.state.currency}</span>
                        </span>
                        <div id={"flag"}>
                            <img src={this.state.flag} alt={"Official country flag"}/>
                        </div>
                        <span onClick={this.handleClose} id={"close-btn"}>X</span>
                    </div>
                </div>
            </div>
        );
    };
}
