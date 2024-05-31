import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  type QueryParams,
  DefaultDataService,
  HttpUrlGenerator,
} from '@ngrx/data';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DashboardDataService } from '../../shared/data';
import { type HistoricalCollect } from '../entities';

@Injectable()
export class HistoricalCollectDataService extends DefaultDataService<HistoricalCollect> {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    httpUrlGenerator: HttpUrlGenerator,
    private dashboardDataService: DashboardDataService
  ) {
    super('CollectAmount', httpClient, httpUrlGenerator);
  }

  getWithQuery(params: QueryParams) {
    return this.dashboardDataService.getHistorical(params).pipe(
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
