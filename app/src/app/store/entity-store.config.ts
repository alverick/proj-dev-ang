import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CompanyEffects } from './effects/company.effects';
import { companyFeature } from './reducers/company.reducer';

export const entityStoreConfig = [
  provideState(companyFeature),
  provideEffects([CompanyEffects]),
];
