import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type QueryParams } from '@ngrx/data';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type CollectAmount, type TopClient } from '../../store/entities';

export interface HistoricalData {
  service: string;
  amountCollected: number[];
  date: string[];
}

export interface SendReport {
  status: string;
}

@Injectable()
export class DashboardDataService {
  constructor(private http: HttpClient) {}

  getAmounts(filterData: QueryParams): Observable<CollectAmount[]> {
    const url = `${environment.END_POINT}/dashBoard/collectAmount`;
    return this.http
      .get<CollectAmount[]>(url, { params: filterData })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getClients(filterData: any): Observable<TopClient[]> {
    const url = `${environment.END_POINT}/dashBoard/topClients`;
    return this.http
      .get<TopClient[]>(url, { params: filterData })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getHistorical(filterData: any): Observable<HistoricalData[]> {
    const url = `${environment.END_POINT}/dashBoard/historicalCollect`;
    return this.http
      .get<HistoricalData[]>(url, { params: filterData })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  sendEmail(form: FormData): Observable<SendReport[]> {
    const url = `${environment.END_POINT}/dashBoard/sendReport`;
    return this.http
      .post<SendReport[]>(url, form)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
