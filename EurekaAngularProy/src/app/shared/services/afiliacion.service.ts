import { Injectable } from "@angular/core";
import { ServiceModel, RubroModel, MonedaModel } from '../models';
import { Observable, throwError, of } from "rxjs";
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
        servicio: '',
        rubro: 0,
        codDeudor: 1,
        tipoDato: '01',
        nroCuenta: '',
        moneda: 'PEN',
        usaAgente: false,
        usaTienda: false,
        usaWebApp: false,
        cobraMora: 'N',
        periodoMora: 1,
        tipoMora: 'P',
        monto: 0,
        porcentaje: 0
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

    public GetRubros(): Observable<RubroModel[]> {
        return of<RubroModel[]>([
            { id: 1, name: "Colegios" },
            { id: 2, name: "Servicio Público" },
            { id: 3, name: "Seguros" }
        ]);
    }

    public GetCodDeudor(): Observable<any[]> {
        return of<any[]>([
            { code: 1, name: "DNI" },
            { code: 2, name: "RUC" },
            { code: 3, name: "Código" },
            { code: 4, name: "Otro" }
        ]);
    }

    public GetTipoDato(): Observable<any[]> {
        return of<any[]>([
            { code: "01", name: "Tengo su código, nombres y deuda" },
            { code: "02", name: "Tengo solo código y nombres" }
        ]);
    }

    public GetMoneda(): Observable<MonedaModel[]> {
        return of<MonedaModel[]>([
            { code: 'PEN', name: 'Soles', symbol: 'S/' },
            { code: 'USD', name: 'Dólares', symbol: '$' }
        ]);
    }

    public GetPeriodoMora(): Observable<any[]> {
        return of<any[]>([
            { code: 1, name: 'Diario' },
            { code: 2, name: 'FIjo' }
        ]);
    }
}
