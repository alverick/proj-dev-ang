import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type Debts, type DebtsPagedList } from '../models/debts';

@Injectable()
export class DebtDataService {
  constructor(private readonly http: HttpClient) {}

  deleteAll(ids): Observable<any> {
    const url = `${environment.END_POINT}/debt/deleteAll`;
    return this.http
      .post<Debts>(url, { ids })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getAll(params: any): Observable<DebtsPagedList> {
    const url = `${environment.END_POINT}/debt`;
    return this.http
      .get<DebtsPagedList>(url, { params })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
