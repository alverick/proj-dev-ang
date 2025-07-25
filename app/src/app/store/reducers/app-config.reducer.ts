import { createFeature, createReducer, on } from '@ngrx/store';

import { AppConfigActions } from '../actions/app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export interface AppConfigState {
  loaded: boolean;
  disabledAffiliation: boolean;
  showedCommission: boolean;
  showLoader: boolean;
}

export const initialState: AppConfigState = {
  loaded: false,
  disabledAffiliation: true,
  showedCommission: false,
  showLoader: true,
};

export const reducer = createReducer(
  initialState,
  on(AppConfigActions.loadConfig, (state): AppConfigState => state),
  on(AppConfigActions.resetConfig, (): AppConfigState => initialState),
  on(
    AppConfigActions.loadConfigSuccess,
    (state, action): AppConfigState => state,
  ),
  on(
    AppConfigActions.loadConfigFailure,
    (state, action): AppConfigState => state,
  ),
  on(
    AppConfigActions.setModalCommissions,
    (state, action): AppConfigState => ({
      ...state,
      showedCommission: action.showed,
    }),
  ),
  on(
    AppConfigActions.setLoader,
    (state, action): AppConfigState => ({ ...state, showLoader: action.show }),
  ),
);

export const appConfigFeature = createFeature({
  name: appConfigFeatureKey,
  reducer,
});
