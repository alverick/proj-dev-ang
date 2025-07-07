export interface Currency {
  symbol: string;
  code: CurrencyCodeType;
  iso: string;
  label: CurrencyLabelType;
  locale: string;
}

export type CurrencyWithLimit = Currency & { limitMax: number };

export const CurrenciesLabels = {
  soles: 'Soles',
  dollars: 'Dólares',
} as const;

export const CurrenciesCodes = {
  soles: '001',
  dollars: '002',
} as const;

export type CurrencyLabelType =
  (typeof CurrenciesLabels)[keyof typeof CurrenciesLabels];

export type CurrencyCodeType =
  (typeof CurrenciesCodes)[keyof typeof CurrenciesCodes];

export const currencies: Currency[] = [
  {
    label: CurrenciesLabels.soles,
    symbol: 'S/',
    iso: 'PEN',
    locale: 'es-PE',
    code: CurrenciesCodes.soles,
  },
  {
    label: CurrenciesLabels.dollars,
    symbol: '$',
    iso: 'USD',
    locale: 'en-US',
    code: CurrenciesCodes.dollars,
  },
];
