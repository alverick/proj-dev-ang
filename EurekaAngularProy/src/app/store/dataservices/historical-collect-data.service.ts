import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DefaultDataService,
  HttpUrlGenerator,
  type QueryParams,
} from '@ngrx/data';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DashboardDataService } from '../../shared/data';
import { type HistoricalCollect } from '../entities';

@Injectable()
export class HistoricalCollectDataService extends DefaultDataService<HistoricalCollect> {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly store: Store,
    httpUrlGenerator: HttpUrlGenerator,
    private readonly dashboardDataService: DashboardDataService,
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
        },
      ),
    );
  }
}
