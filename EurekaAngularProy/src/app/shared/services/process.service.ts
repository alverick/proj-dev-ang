import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProcessService {
  constructor(private http: HttpClient) {}

  getList(clientId, page: number) {
    const limit = 50;
    const start = (page - 1) * limit;
    const url = `${environment.END_POINT}/Company/GTP/client/${clientId}/process?start=${start}&limit=${limit}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  getFile(processId: number) {
    const url = `${environment.END_POINT}/Company/GTP/process/${processId}/file`;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
