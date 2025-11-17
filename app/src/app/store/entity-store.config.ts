import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { CompanyEffects } from './effects/company.effects';
import { companyFeature } from './reducers/company.reducer';

export const entityStoreConfig = [
  provideState(companyFeature),
  provideEffects([CompanyEffects]),
];
