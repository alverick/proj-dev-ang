import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private http: HttpClient) {}

  getList(clientId, page: number): Observable<any> {
    const limit = 50;
    const start = (page - 1) * limit;
    const url = `${environment.END_POINT}/Company/GTP/client/${clientId}/process?start=${start}&limit=${limit}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((error) => throwError(error)));
  }

  getFile(processId: number): Observable<any> {
    const url = `${environment.END_POINT}/Company/GTP/process/${processId}/file`;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(catchError((error) => throwError(error)));
  }
}
