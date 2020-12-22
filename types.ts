export interface Currency {
  code: string;
}

export interface Country {
  name: string;
  currencies: Currency[];
  alpha2Code: string;
  alpha3Code: string;
  flag: string;
  callingCodes: string[];
  borders: string[];
}

export interface EventWithId {
  currentTarget: {
    id: string;
  };
}

export interface Action {
  type: string;
  payload: any;
}
