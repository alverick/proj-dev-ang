import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { type AmountLimit } from '../../shared/models/data-enterprise.model';

export const CompanyActions = createActionGroup({
  source: 'Company',
  events: {
    'Load Company': emptyProps(),
    'Load Company Failure': props<{ error: any }>(),
    'Set Currency Limits': props<{ amountLimits: AmountLimit[] }>(),
    'Set Company Loader': props<{ show: boolean }>(),
  },
});
