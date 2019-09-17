import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, map } from "rxjs/operators";
import { DataEnterpriseModel } from "../models/data-enterprise.model";

@Injectable()
export class ConfiguracionService {

    constructor(private http: HttpClient, private storage: StorageService){}

    public debtItems: DataEnterpriseModel ;

    getDatosEmpresa(): Observable<DataEnterpriseModel> { 
    const url = `${environment.END_POINT}/company?_=`+ new Date().getTime();

    const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
    return this.http.get<DataEnterpriseModel>(url, opts)
        .pipe(map(r => { 
          r.newPassword = '';
          r.password = '';
          r.confirmNewPassword  = ''; 
          
          return r;
        }))
        .pipe(catchError(err => throwError(err)));

    }

    saveDatosEmpresa(data: any): Observable<any> { 
    const url=`${environment.END_POINT}/company?_=`+ new Date().getTime();
    const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
    return this.http.put(url, data, opts).pipe(catchError(err => throwError(err)));
    }

}