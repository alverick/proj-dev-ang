import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type IEntryModel } from '../models';

@Injectable()
export class EnterpriseHeadingService {
  constructor(private readonly http: HttpClient) {}
  public getEntryOptions(): Observable<IEntryModel[]> {
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
