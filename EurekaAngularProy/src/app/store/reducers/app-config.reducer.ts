import { createFeature, createReducer, on } from '@ngrx/store';

import { AppConfigActions } from '../actions/app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export interface State {
  loaded: boolean;
  disabledAffiliation: boolean;
  showedCommission: boolean;
}

export const initialState: State = {
  loaded: false,
  disabledAffiliation: true,
  showedCommission: false,
};

export const reducer = createReducer(
  initialState,
  on(AppConfigActions.loadConfig, (state): State => state),
  on(AppConfigActions.resetConfig, (): State => initialState),
  on(AppConfigActions.loadConfigSuccess, (state, action): State => state),
  on(AppConfigActions.loadConfigFailure, (state, action): State => state),
  on(
    AppConfigActions.setModalCommissions,
    (state, action): State => ({ ...state, showedCommission: action.showed })
  )
);

export const appConfigFeature = createFeature({
  name: appConfigFeatureKey,
  reducer,
});
