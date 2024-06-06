import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounce, EMPTY, of, timer } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { AppConfigActions } from '../actions/app-config.actions';
import { appConfigFeature } from '../reducers/app-config.reducer';

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
  setLoaderAppConfigs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppConfigActions.setLoader),
        concatLatestFrom(() =>
          this.store.select(appConfigFeature.selectShowLoader)
        ),
        debounce(([{ show }]) => {
          console.log('debounce', show, Date.now());
          return show ? timer(0) : timer(1000);
        }),
        tap(([{ show }]) => {
          console.log('effectLoader', show, Date.now());
          if (show) {
            void this.spinner.show();
          } else {
            void this.spinner.hide();
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private spinner: NgxSpinnerService
  ) {}
}
