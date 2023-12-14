import { createAction, props } from '@ngrx/store';

import { IDataEnterpriseModel } from '../../shared/models/data-enterprise.model';

export const loadCompany = createAction('[Company] Load Company');

export const loadCompanySuccess = createAction(
  '[Company] Load Company Success',
  props<{ data: IDataEnterpriseModel }>()
);

export const setCurrencyLimits = createAction('[Company] Set Company Limits');

export const loadCompanyFailure = createAction(
  '[Company] Load Company Failure',
  props<{ error: any }>()
);
