import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { CompanyService } from '../../shared/services';
import { CompanyActions } from '../actions/company.actions';

@Injectable()
export class CompanyEffects {
  loadCompany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActions.loadCompany),
      concatMap(() =>
        this.companyService.getCompanyData().pipe(
          map((data) =>
            CompanyActions.setCurrencyLimits({
              amountLimits: data.amountLimits,
            }),
          ),
          catchError((error) =>
            of(CompanyActions.loadCompanyFailure({ error })),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly companyService: CompanyService,
    private readonly store: Store,
  ) {}
}
