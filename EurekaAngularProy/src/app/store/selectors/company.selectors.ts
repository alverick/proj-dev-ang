import { createFeatureSelector, createSelector } from '@ngrx/store';

import { type IDataEnterpriseModel } from '../../shared/models/data-enterprise.model';
import { selectDetails } from '../reducers/company.reducer';
import * as fromCompany from '../reducers/company.reducer';

export const selectCompanyState = createFeatureSelector<fromCompany.State>(
  fromCompany.companyFeatureKey,
);

export const selectCompanyLimits = createSelector(
  selectDetails,
  (state: IDataEnterpriseModel) => state?.amountLimits,
);
