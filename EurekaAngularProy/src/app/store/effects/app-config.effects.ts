import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { AppConfigActions } from '../actions/app-config.actions';

@Injectable()
export class AppConfigEffects {
  configAppConfigs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppConfigActions.loadConfig),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map((data) => AppConfigActions.loadConfigSuccess({ data })),
          catchError((error) =>
            of(AppConfigActions.loadConfigFailure({ error }))
          )
        )
      )
    );
  });

  constructor(private actions$: Actions) {}
}
