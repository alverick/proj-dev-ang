import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  type AuthForm,
  type RegisterForm,
} from '../../features/auth/services/affiliation-forms.service';
import { type IServicePostData, type IServiceRemoteModel } from '../models';
import { type IAccountStateDetails } from '../models/company';
import { type IDataEnterpriseModel } from '../models/data-enterprise.model';
import { type FingerPrintData } from './digital-data.service';

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

type ValidateCompanyData = Partial<RegisterForm> & { sdk: FingerPrintData };
type SaveCompanyData = Partial<RegisterForm> &
  Partial<AuthForm> & { sdk: FingerPrintData };

@Injectable()
export class CompanyService {
  constructor(private http: HttpClient) {}

  public validateCompany(
    data: ValidateCompanyData
  ): Observable<ICompanyResult> {
    return this.http.post<ICompanyResult>(
      `${environment.END_POINT}/company/validate`,
      data
    );
  }

  public saveCompany(data: SaveCompanyData): Observable<ICompanyResult> {
    return this.http.post<ICompanyResult>(
      `${environment.END_POINT}/company`,
      data
    );
  }

  updateCompany(data: any): Observable<ICompanyResult> {
    const url = `${environment.END_POINT}/company`;
    return this.http.put<ICompanyResult>(url, data);
  }

  saveServices(data: IServicePostData) {
    return this.http.post<any>(
      `${environment.END_POINT}/company/service`,
      data
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
    return this.http.post<any>(
      `${environment.END_POINT}/company/gtp/client/update`,
      data
    );
  }

  getCompanyData(): Observable<IDataEnterpriseModel> {
    const url = `${environment.END_POINT}/company/getafiliate`;
    return this.http.get<IDataEnterpriseModel>(url);
  }

  getAccountStateDetails(idCompany: string): Observable<IAccountStateDetails> {
    return this.http.get<IAccountStateDetails>(
      `${environment.END_POINT}/company/GTP/accountStateDetails/${idCompany}`
    );
  }

  getAccountStateDetailsList(): Observable<Blob> {
    return this.http.get(
      `${environment.END_POINT}/company/GTP/AccountStateDetailsList`,
      {
        responseType: 'blob',
      }
    );
  }

  getCompanyServices(
    incDeactivates: boolean = false
  ): Observable<IServiceRemoteModel[]> {
    return this.http.get<IServiceRemoteModel[]>(
      `${
        environment.END_POINT
      }/company/service?incDeactivates=${incDeactivates.toString()}`
    );
  }
}
