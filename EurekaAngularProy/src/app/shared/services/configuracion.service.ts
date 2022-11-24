import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDataEnterpriseModel } from '../models/data-enterprise.model';
import { StorageService } from './storage.service';

@Injectable()
export class ConfiguracionService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  public debtItems: IDataEnterpriseModel;
  getDatosEmpresa(): Observable<IDataEnterpriseModel> {
    const url = `${environment.END_POINT}/company?_=` + new Date().getTime();
    const opts = {
      headers: { Authorization: 'bearer ' + this.storage.getCurrentToken() },
    };
    return this.http
      .get<IDataEnterpriseModel>(url, opts)
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
    const url = `${environment.END_POINT}/company?_=` + new Date().getTime();
    const opts = {
      headers: { Authorization: 'bearer ' + this.storage.getCurrentToken() },
    };
    return this.http
      .put(url, data, opts)
      .pipe(catchError((err) => throwError(err)));
  }
}
