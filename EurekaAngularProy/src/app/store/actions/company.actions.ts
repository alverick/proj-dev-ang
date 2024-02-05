import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { type IDataEnterpriseModel } from '../../shared/models/data-enterprise.model';

export const CompanyActions = createActionGroup({
  source: 'Company',
  events: {
    'Load Company': emptyProps(),
    'Load Company Success': props<{ data: IDataEnterpriseModel }>(),
    'Load Company Failure': props<{ error: any }>(),
    'Set Currency Limits': emptyProps(),
  },
});
