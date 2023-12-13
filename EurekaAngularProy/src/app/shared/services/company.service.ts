import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IServicePostData, IServiceRemoteModel } from '../models';
import { IAccountStateDetails } from '../models/company';
import { IDataEnterpriseModel } from '../models/data-enterprise.model';

export interface ICompanyResult {
  success: boolean;
  code?: number;
  message?: string;
  details?: string;
  id?: number;
  tradeName?: string;
  fullName?: string;
}

export interface CompanyAccounts {
  currency: string;
  number: string;
  id: string;
}

@Injectable()
export class CompanyService {
  constructor(private http: HttpClient) {}

  public validateCompany(data: any): Observable<ICompanyResult> {
    return this.http
      .post<ICompanyResult>(`${environment.END_POINT}/company/validate`, data)
      .pipe(catchError((err) => throwError(err)));
  }

  public saveCompany(data: any): Observable<ICompanyResult> {
    return this.http
      .post<ICompanyResult>(`${environment.END_POINT}/company`, data)
      .pipe(catchError((err) => throwError(err)));
  }

  updateCompany(data: any): Observable<ICompanyResult> {
    const url = `${environment.END_POINT}/company`;
    return this.http
      .put<ICompanyResult>(url, data)
      .pipe(catchError((err) => throwError(err)));
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
    return this.http.get<CompanyAccounts[]>(
      `${environment.END_POINT}/company/cards`
    );
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

  getCompanyData(): Observable<IDataEnterpriseModel> {
    const url = `${environment.END_POINT}/company/getafiliate`;
    return this.http
      .get<IDataEnterpriseModel>(url)
      .pipe(catchError((err) => throwError(err)));
  }

  getAccountStateDetails(idCompany: string): Observable<IAccountStateDetails> {
    return this.http
      .get<IAccountStateDetails>(
        `${environment.END_POINT}/company/GTP/accountStateDetails/${idCompany}`
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAccountStateDetailsList(): Observable<Blob> {
    return this.http
      .get(`${environment.END_POINT}/company/GTP/AccountStateDetailsList`, {
        responseType: 'blob',
      })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getCompanyServices(
    incDeactivates: boolean = false
  ): Observable<IServiceRemoteModel[]> {
    return this.http
      .get<IServiceRemoteModel[]>(
        `${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}`
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
