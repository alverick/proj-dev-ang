import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AppConfigActions = createActionGroup({
  source: 'AppConfig',
  events: {
    'Load Config': emptyProps(),
    'Reset Config': emptyProps(),
    'Load Config Success': props<{ data: boolean }>(),
    'Load Config Failure': props<{ error: any }>(),
    'Set Modal Commissions': props<{ showed: boolean }>(),
    'Set Loader': props<{ show: boolean }>(),
  },
});
