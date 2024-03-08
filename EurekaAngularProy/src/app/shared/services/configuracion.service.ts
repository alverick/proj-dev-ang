import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type IDataEnterpriseModel } from '../models/data-enterprise.model';

@Injectable()
export class ConfiguracionService {
  constructor(private http: HttpClient) {}

  getDatosEmpresa(): Observable<IDataEnterpriseModel> {
    const url = `${environment.END_POINT}/company/getafiliate`;
    return this.http
      .get<IDataEnterpriseModel>(url)
      .pipe(
        map((r) => {
          r.newPassword = '';
          r.password = '';
          r.confirmNewPassword = '';
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  saveDatosEmpresa(data: any): Observable<any> {
    const url = `${environment.END_POINT}/company`;
    return this.http.put(url, data).pipe(catchError((err) => throwError(err)));
  }
}
