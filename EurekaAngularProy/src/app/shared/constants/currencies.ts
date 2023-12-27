export interface Currency {
  symbol: string;
  code: string;
  iso: string;
  label: string;
  locale: string;
}

export type CurrencyWithLimit = Currency & { limitMax: number };

export const currencies: Currency[] = [
  {
    label: 'Soles',
    symbol: 'S/',
    iso: 'PEN',
    locale: 'es-PE',
    code: '001',
  },
  {
    label: 'Dólares',
    symbol: '$',
    iso: 'USD',
    locale: 'en-US',
    code: '002',
  },
];
