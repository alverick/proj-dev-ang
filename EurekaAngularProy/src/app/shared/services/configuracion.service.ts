import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataEnterpriseModel } from '../models/data-enterprise.model';

@Injectable()
export class ConfiguracionService {
  constructor(private http: HttpClient) {}

  public debtItems: DataEnterpriseModel;
  getDatosEmpresa(): Observable<DataEnterpriseModel> {
    const url = `${environment.END_POINT}/company/getafiliate`;
    return this.http
      .get<DataEnterpriseModel>(url)
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
