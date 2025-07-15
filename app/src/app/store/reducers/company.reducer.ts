import { createFeature, createReducer, on } from '@ngrx/store';

import {
  currencies,
  type CurrencyWithLimit,
} from '../../shared/constants/currencies';
import { CompanyActions } from '../actions/company.actions';

export const companyFeatureKey = 'company';

export interface State {
  currencyLimits: CurrencyWithLimit[];
  useAmountLimits: boolean;
}

export const initialState: State = {
  currencyLimits: null,
  useAmountLimits: false,
};

export const reducerCompany = createReducer(
  initialState,
  on(CompanyActions.loadCompany, (state): State => state),
  on(CompanyActions.setCurrencyLimits, (state, action): State => {
    const currencyLimits = action.amountLimits.map((item) => {
      const currencyElm = currencies.find(
        (currency) => currency.code === item.currency,
      );
      return { ...currencyElm, limitMax: item.amountMax };
    });
    return {
      ...state,
      currencyLimits: currencyLimits,
    };
  }),
  on(CompanyActions.loadCompanyFailure, (state, action): State => state),
);

export const companyFeature = createFeature({
  name: companyFeatureKey,
  reducer: reducerCompany,
});
