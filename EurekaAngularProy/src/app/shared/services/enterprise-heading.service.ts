import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IEntryModel } from '../models';

@Injectable()
export class EnterpriseHeadingService {
  constructor(private http: HttpClient) {}
  public getEntryOptions(): Observable<IEntryModel[]> {
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading`)
      .pipe(catchError((err) => throwError(err)));
  }
}
