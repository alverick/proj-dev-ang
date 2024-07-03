import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  type QueryParams,
  DefaultDataService,
  HttpUrlGenerator,
} from '@ngrx/data';
import { Store } from '@ngrx/store';
import { type Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DashboardDataService } from '../../shared/data';
import { type TopClient } from '../entities';

@Injectable()
export class TopClientDataService extends DefaultDataService<TopClient> {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    httpUrlGenerator: HttpUrlGenerator,
    private dashboardDataService: DashboardDataService
  ) {
    super('CollectAmount', httpClient, httpUrlGenerator);
  }

  getWithQuery(params: QueryParams): Observable<TopClient[] | any> {
    return this.dashboardDataService.getClients(params).pipe(
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
