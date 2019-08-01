import { Injectable } from "@angular/core";
import { ServiceModel } from '../models/services.model';
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { catchError, map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class AfiliacionService {
    constructor(private http: HttpClient, 
        private spinner: NgxSpinnerService){}

    public idCompany: number = 0;

    public serviceActual: ServiceModel = {
        usaAgente: false,
        usaTienda: false,
        usaWebApp: false
    };

    public get UsaUnMedio(): boolean {
        return this.serviceActual.usaAgente || this.serviceActual.usaTienda || this.serviceActual.usaWebApp;
    }

    public Registrar(data: any): Observable<any> {
        this.spinner.show();
        return this.http.post<any>(`${environment.END_POINT}/company`, data)
            .pipe(map(r => {
                this.spinner.hide();
                this.idCompany = r.id;
                return r;
            }))
            .pipe(catchError(err => {
                this.spinner.hide();
                return throwError(err);
            }));
    }
}