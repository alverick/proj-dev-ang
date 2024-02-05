import { createAction, props } from '@ngrx/store';

export const configAppConfigs = createAction('[AppConfig] Config AppConfigs');

export const configAppConfigsSuccess = createAction(
  '[AppConfig] Config AppConfigs Success',
  props<{ data: any }>()
);

export const configAppConfigsFailure = createAction(
  '[AppConfig] Config AppConfigs Failure',
  props<{ error: any }>()
);
