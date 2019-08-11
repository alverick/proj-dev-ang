import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { catchError } from "rxjs/operators";
import { DataEnterpriseModel } from "../models/data-enterprise.model";

@Injectable()
export class ConfiguracionService {

    constructor(private http: HttpClient, private storage: StorageService){}


    getDatosEmpresa(): Observable<DataEnterpriseModel>{
    console.log("Begin get datos empresa")
    const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
    return this.http.get<DataEnterpriseModel>(`${environment.END_POINT}/company`, opts)
        .pipe(catchError(err => throwError(err)));

    }

    saveDatosEmpresa(data: DataEnterpriseModel): Observable<DataEnterpriseModel>{
        
    console.log("Begin Save datos empresa");
    const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
    return this.http.put(`${environment.END_POINT}/company`, data, opts).pipe(catchError(err => throwError(err)));
    }

}