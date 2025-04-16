import { createFeature, createReducer, on } from '@ngrx/store';

import {
  currencies,
  type CurrencyWithLimit,
} from '../../shared/constants/currencies';
import { type IDataEnterpriseModel } from '../../shared/models/data-enterprise.model';
import { CompanyActions } from '../actions/company.actions';

export const companyFeatureKey = 'company';

export interface State {
  details: IDataEnterpriseModel;
  currencyLimits: CurrencyWithLimit[];
  useAmountLimits: boolean;
}

export const initialState: State = {
  details: null,
  currencyLimits: null,
  useAmountLimits: false,
};

export const reducerCompany = createReducer(
  initialState,
  on(CompanyActions.loadCompany, (state): State => state),
  on(
    CompanyActions.loadCompanySuccess,
    (state, action): State => ({ ...state, details: action.data }),
  ),
  on(CompanyActions.setCurrencyLimits, (state): State => {
    const currencyLimits = state.details.amountLimits.map((item) => {
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

export const { name, reducer, selectDetails } = companyFeature;
