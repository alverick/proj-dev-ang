import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  type QueryParams,
  DefaultDataService,
  HttpUrlGenerator,
} from '@ngrx/data';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DashboardDataService } from '../../shared/data';
import { type CollectAmount } from '../entities';

@Injectable()
export class CollectAmountDataService extends DefaultDataService<CollectAmount> {
  constructor(
    private _httpClient: HttpClient,
    private store: Store<any>,
    httpUrlGenerator: HttpUrlGenerator,
    private dashboardDataService: DashboardDataService
  ) {
    super('CollectAmount', _httpClient, httpUrlGenerator);
  }

  getWithQuery(params: QueryParams) {
    return this.dashboardDataService.getAmounts(params).pipe(
      map((result) => {
        const parsedObject = { ...result[0], id: 1 };
        const parsedResult = [parsedObject];
        return parsedResult;
      }),
      catchError(
        // TODO: Use action factory
        (err) => {
          this.store.dispatch({
            type: '[Get] @ngrx/data/query-all/failure"',
            payload: err.message,
          });
          return of(err);
        }
      )
    );
  }
}
