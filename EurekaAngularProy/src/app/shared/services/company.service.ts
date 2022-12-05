import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IServicePostData } from '../models';
import { IAccountStateDetails } from '../models/company';

export interface ICompanyResult {
  success: boolean;
  code?: number;
  message?: string;
  id?: number;
}

@Injectable()
export class CompanyService {
  constructor(private http: HttpClient) {}

  public validateCompany(data: any): Observable<ICompanyResult> {
    return this.http
      .post<any>(`${environment.END_POINT}/company/validate`, data)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public saveCompany(data: any): Observable<ICompanyResult> {
    return this.http.post<any>(`${environment.END_POINT}/company`, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  saveServices(data: IServicePostData) {
    return this.http
      .post<any>(`${environment.END_POINT}/company/service`, data)
      .pipe(
        catchError((err) => {
          throw throwError(err);
        })
      );
  }

  getCompanyAccountsById(idCompany) {
    return this.http.get<any[]>(
      `${environment.END_POINT}/company/${idCompany}/cards`
    );
  }

  getCompanyAccounts() {
    return this.http.get<any[]>(`${environment.END_POINT}/company/cards`);
  }

  sendUpdateCompanyData(data) {
    return this.http
      .post<any>(`${environment.END_POINT}/company/gtp/client/update`, data)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAcountStateDetails(idCompany): Observable<IAccountStateDetails> {
    return this.http
      .get<any>(
        `${environment.END_POINT}/company/GTP/accountStateDetails/${idCompany}`
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAcountStateDetailsList(): Observable<Blob> {
    return this.http
      .get<Blob>(
        `${environment.END_POINT}/company/GTP/AccountStateDetailsList`,
        { responseType: 'blob' }
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
