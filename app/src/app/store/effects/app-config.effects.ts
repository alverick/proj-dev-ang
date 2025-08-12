import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounce, EMPTY, of, timer } from 'rxjs';
import { catchError, concatMap, filter, map, tap } from 'rxjs/operators';

import { AppConfigActions } from '../actions/app-config.actions';
import {
  appConfigFeature,
  AppConfigState,
} from '../reducers/app-config.reducer';

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
            of(AppConfigActions.loadConfigFailure({ error })),
          ),
        ),
      ),
    );
  });
  showLoaderEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AppConfigActions.setLoader),
        concatLatestFrom(() =>
          this.store.select(appConfigFeature.selectShowLoader),
        ),
        filter(([{ show }]) => show),
        debounce(() => timer(0)),
        tap(() => {
          void this.spinner.show();
        }),
      );
    },
    { dispatch: false },
  );

  hideLoaderEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AppConfigActions.setLoader),
        concatLatestFrom(() =>
          this.store.select(appConfigFeature.selectShowLoader),
        ),
        filter(([{ show }]) => !show),
        debounce(() => timer(500)),
        tap(() => {
          void this.spinner.hide();
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppConfigState>,
    private readonly spinner: NgxSpinnerService,
  ) {}
}
