export const getCountriesViaApi = () => new Promise((resolve, reject) => {
    const url = "https://restcountries.eu/rest/v2/all";
    const request = new XMLHttpRequest();
    let result;

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            result = JSON.parse(request.response);
            resolve(result);
        }
    };

    request.onerror = () => {
        reject("Something went wrong");
    };

    request.open('GET', url);
    request.send();
});