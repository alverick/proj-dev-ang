import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import * as AppConfigActions from '../actions/app-config.actions';

@Injectable()
export class AppConfigEffects {
  configAppConfigs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppConfigActions.configAppConfigs),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map((data) => AppConfigActions.configAppConfigsSuccess({ data })),
          catchError((error) =>
            of(AppConfigActions.configAppConfigsFailure({ error }))
          )
        )
      )
    );
  });

  constructor(private actions$: Actions) {}
}
