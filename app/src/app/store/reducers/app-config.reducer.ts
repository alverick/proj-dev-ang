import { createFeature, createReducer, on } from '@ngrx/store';

import { AppConfigActions } from '../actions/app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export interface State {
  loaded: boolean;
  disabledAffiliation: boolean;
  showedCommission: boolean;
  showLoader: boolean;
}

export const initialState: State = {
  loaded: false,
  disabledAffiliation: false,
  showedCommission: false,
  showLoader: true,
};

export const reducer = createReducer(
  initialState,
  on(AppConfigActions.loadConfig, (state): State => state),
  on(AppConfigActions.resetConfig, (): State => initialState),
  on(AppConfigActions.loadConfigSuccess, (state, action): State => state),
  on(AppConfigActions.loadConfigFailure, (state, action): State => state),
  on(
    AppConfigActions.setModalCommissions,
    (state, action): State => ({ ...state, showedCommission: action.showed }),
  ),
  on(
    AppConfigActions.setLoader,
    (state, action): State => ({ ...state, showLoader: action.show }),
  ),
);

export const appConfigFeature = createFeature({
  name: appConfigFeatureKey,
  reducer,
});
