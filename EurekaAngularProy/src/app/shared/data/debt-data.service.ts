import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryParams } from '@ngrx/data';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Debt, DebtsPagedList } from 'src/app/entities/debts';
import { environment } from '../../../environments/environment';

@Injectable()
export class DebtDataService {
  constructor(private http: HttpClient) {}

  deleteAll(ids): Observable<any> {
    const url = `${environment.END_POINT}/debt/deleteAll`;
    return this.http
      .post<Debt>(url, { ids })
      .pipe(catchError((error) => throwError(error)));
  }

  getAll(params: QueryParams): Observable<DebtsPagedList> {
    const url = `${environment.END_POINT}/debt`;
    return this.http
      .get<DebtsPagedList>(url, { params })
      .pipe(catchError((error) => throwError(error)));
  }
}
