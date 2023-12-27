import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { CompanyService } from '../../shared/services';
import * as CompanyActions from '../actions/company.actions';

@Injectable()
export class CompanyEffects {
  loadCompany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActions.loadCompany),
      concatMap(() =>
        this.companyService.getCompanyData().pipe(
          map((data) => CompanyActions.loadCompanySuccess({ data })),
          catchError((error) =>
            of(CompanyActions.loadCompanyFailure({ error }))
          )
        )
      )
    );
  });
  loadCompanySuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CompanyActions.loadCompanySuccess),
        tap(() => {
          this.store.dispatch(CompanyActions.setCurrencyLimits());
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private companyService: CompanyService,
    private store: Store
  ) {}
}
