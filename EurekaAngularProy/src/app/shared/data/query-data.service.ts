import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface MessageResult {
  success: boolean;
  code?: number;
  message?: string;
  rows?: number;
  id?: number;
}

@Injectable()
export class QueryDataService {
  constructor(private http: HttpClient) {}

  regularizeAll(): Observable<MessageResult> {
    const url = `${environment.END_POINT}/Query/regularizeStateProcessAll`;
    return this.http
      .post<MessageResult>(url, {})
      .pipe(catchError((error) => throwError(error)));
  }

  regularizeProcessById(processId: number): Observable<MessageResult> {
    const url = `${environment.END_POINT}/Query/regularizeStateProcessById/${processId}`;
    return this.http
      .post<MessageResult>(url, {})
      .pipe(catchError((error) => throwError(error)));
  }
}
