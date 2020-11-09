import React from "react";

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

    getCountriesViaApi = () => new Promise((resolve, reject) => {
        const url = "https://restcountries.eu/rest/v2/all";
        const request = new XMLHttpRequest();
        let result;

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                result = JSON.parse(request.response);
                this.setState({
                    countries: result,
                });
                resolve(result);
            }
        };

        request.onerror = () => {
            reject("Something went wrong");
        };

        request.open('GET', url);
        request.send();
    });

    componentDidMount() {
        this.getCountriesViaApi().then();
    }

    getFullCountryInfo = (e: { currentTarget: { id: any } }) => {
        const currentlySelectedCountry = e.currentTarget.id,
            selectedCountryFullObject = this.state.countries.filter((country) => {
                return country["name"] == currentlySelectedCountry;
            }),
            moreDetails = selectedCountryFullObject[0],
            currency = moreDetails["currencies"][0]["code"],
            alpha2code = moreDetails["alpha2Code"],
            alpha3code = moreDetails["alpha3Code"],
            phoneCode = moreDetails["callingCodes"][0],
            flag = moreDetails["flag"];

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
            hideEmptyState: false,
        })
    }

    renderCountries = () => {
        return this.state.countries.map(country => {
            return (
                <a href="#">
                    <div
                        onClick={this.getFullCountryInfo}
                        className={"country-item"}
                        id={country["name"]}>
                        {country["name"]}
                    </div>
                </a>
            )
        })
    };

    render() {
        return (
            <div className={"main"}>
                <div className={'countries-list'}>
                    {this.renderCountries()}
                </div>
                <div className={"empty-state"} hidden={this.state.hideEmptyState}>
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
                    <div>
                        <img src={this.state.flag} alt={"Official country flag"}/>
                    </div>
                    <span onClick={this.handleClose} id={"close-btn"}>
                        X
                    </span>
                </div>
            </div>
        );
    }
}
