import { Currency } from '../../types';

export const getCurrenciesCodesList = (currencies: Currency[]): string[] => {
  return currencies
    .map(x => x.code)
    .filter(x => x !== null && x !== '(none)');
};
