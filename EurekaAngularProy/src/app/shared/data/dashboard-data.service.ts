import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface CollectAmounts {
  totalChargeAmount: number;
  totalChargePersons: number;
  pendingChargeAmount: number;
  pendingChargePersons: number;
  defaultChargeAmount: number;
  defaultChargePersons: number;
}

export interface TopClients {
  name: string;
  lastName: string;
  code: string;
  service: string;
  currency?: string;
  totalAmount: number;
  totalDefault: number;
}

export interface HistoricalData {
  service: string;
  amountCollected: number[];
  date: string[];
}

@Injectable()
export class DashboardDataService {
  constructor(private http: HttpClient) {}

  getAmounts(filterData: any): Observable<CollectAmounts[]> {
    const url = `${environment.END_POINT}/dashBoard/collectAmount`;
    return this.http
      .get<CollectAmounts[]>(url, { params: filterData })
      .pipe(catchError((error) => throwError(error)));
  }

  getClients(filterData: any): Observable<TopClients[]> {
    const url = `${environment.END_POINT}/dashBoard/topClients`;
    return this.http
      .get<TopClients[]>(url, { params: filterData })
      .pipe(catchError((error) => throwError(error)));
  }

  getHistorical(filterData: any): Observable<HistoricalData[]> {
    const url = `${environment.END_POINT}/dashBoard/historicalCollect`;
    return this.http
      .get<HistoricalData[]>(url, { params: filterData })
      .pipe(catchError((error) => throwError(error)));
  }
}
