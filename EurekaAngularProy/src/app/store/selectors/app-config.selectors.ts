import { createFeatureSelector } from '@ngrx/store';

import * as fromAppConfig from '../reducers/app-config.reducer';

export const selectAppConfigState = createFeatureSelector<fromAppConfig.State>(
  fromAppConfig.appConfigFeatureKey
);
