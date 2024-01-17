import { createFeature, createReducer, on } from '@ngrx/store';

import * as AppConfigActions from '../actions/app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export interface State {
  loaded: boolean;
  disabledAffiliation: boolean;
}

export const initialState: State = {
  loaded: false,
  disabledAffiliation: false,
};

export const reducer = createReducer(
  initialState,
  on(AppConfigActions.configAppConfigs, (state) => state),
  on(AppConfigActions.configAppConfigsSuccess, (state, action) => state),
  on(AppConfigActions.configAppConfigsFailure, (state, action) => state)
);

export const appConfigFeature = createFeature({
  name: appConfigFeatureKey,
  reducer,
});
