import { Injectable } from "@angular/core";
import { ServiceModel, RubroModel, MonedaModel } from '../models';
import { Observable, throwError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { catchError, map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";

@Injectable()
export class AfiliacionService {
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService, private storage: StorageService) {}

  public idCompany: number = 0;

  public services: ServiceModel[] = [];

  public Clear() {
    this.services.push({
      nombre: 'Mensualidad',
      codDeudor: 'DNI',
      tipoDato: 'C',
      tipoPago: 'C',
      nroCuenta: '',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '1',
      tipoMora: 'M',
      monto: 0,
      porcentaje: 0
    });
  }

  public AddService(svc: ServiceModel) {
    var svc_old = this.services.find((v) => v.nombre === svc.nombre);
    if (svc_old) {
      Swal.fire({
        type: 'error',
        text: 'Este servicio ya existe',
        allowOutsideClick: false
      });
    } else {
      this.services.push(svc);
    }
  }

  public DelService(index: number) {
    this.services.splice(index, 1);
  }

  public SendDelService(index: number) {
    let url = `${environment.END_POINT}/service/${this.services[index].id}`;
    return this.http.delete(url)
      .pipe(map(r => {
        this.services.splice(index, 1);
        return r;
      }));
  }

  public CanDeleteService(index: number) {
    let url = `${environment.END_POINT}/service/${this.services[index].id}/canDelete`;
    return this.http.get<any>(url);
  }

  public Registrar(data: any): Observable<any> {
    this.spinner.show();
    return this.http.post<any>(`${environment.END_POINT}/company?_=`+ new Date().getTime(), data)
      .pipe(map(r => {
        this.spinner.hide();
        if (r.success) {
          this.idCompany = r.id;
        }
        return r;
      }))
      .pipe(catchError(err => {
        this.spinner.hide();
        return throwError(err);
      }));
  }


  public GetRubros(): Observable<RubroModel[]> {
    return this.http.get<RubroModel[]>(`${environment.END_POINT}/enterpriseHeading?_=`+ new Date().getTime())
      .pipe(catchError(err => throwError(err)));
  }

  public GetCodDeudor(): Observable < any[] > {
    return of<any[]>([{
        code: 'DNI',
        name: "DNI"
      },
      {
        code: 'RUC',
        name: "RUC"
      },
      {
        code: 'Codigo Interno',
        name: "Código"
      },
      {
        code: 'Otro',
        name: "Otro"
      }
    ]);
  }

  public GetTipoDato(): Observable < any[] > {
    return of<any[]>([{
        code: 'C',
        name: "Tengo su código, nombres y deuda"
      },
      {
        code: 'P',
        name: "Tengo solo código y nombres"
      }
    ]);
  }

  public GetTipoPago(): Observable < any[] > {
    return of<any[]>([{
        code: 'C',
        name: "Pueden elegir qué deuda quieren pagar"
      },
      {
        code: 'P',
        name: "Siempre la deuda que vence primero"
      }
    ]);
  }

  public GetMoneda(): Observable < MonedaModel[] > {
    return of<MonedaModel[]>([{
        code: '001',
        name: 'Soles',
        symbol: 'S/'
      },
      {
        code: '002',
        name: 'Dólares',
        symbol: '$'
      }
    ]);
  }

  public GetPeriodoMora(): Observable<any[]> {
    return of<any[]> ([{
        id: '1',
        name: 'Diario'
      },
      {
        id: '2',
        name: 'Fijo'
      }
    ]);
  }

  public GetServicios(incDeactivates: boolean = false) {

    const headers: any = {
        "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
        "Ocp-Apim-Trace": "true"
      };
      if(this.storage.isAuthenticated) {
        headers["Authorization"] = "bearer " + this.storage.getCurrentToken();
      }
    this.http.get<any[]>(`${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}&_=`+ new Date().getTime(), { headers: headers })
      .subscribe(d => {
        let servicios = [];
        d.forEach(s => {
          servicios.push({
            id: s.id,
            nombre: s.name,
            rubro: s.entry,
            codDeudor: s.debtorCode,
            tipoDato: s.dataType,
            tipoPago: s.paymentType,
            nroCuenta: s.accountNumber,
            moneda: s.currency,
            simboloMoneda: s.currencySymbol,
            usaWebApp: s.useAppWeb,
            usaAgente: s.useAgent,
            usaTienda: s.useStore,
            cobraMora: s.chargeInterest,
            periodoMora: s.chargeType.toString(),
            tipoMora: s.interestType,
            monto: s.amount,
            porcentaje: s.percentage,
            inReview: s.inReview
          });
        });
        this.services = servicios;
      });


  }

  public GrabarServicios(): Observable<any> {
    this.spinner.show();
    const data = { clientId: this.idCompany, services: [], deleted: [] };
    this.services.forEach(s => {
      data.services.push({
        id: s.id,
        name: s.nombre,
        entry: s.rubro,
        debtorCode: s.codDeudor,
        dataType: s.tipoDato,
        paymentType: s.tipoPago,
        accountNumber: s.nroCuenta,
        currency: s.moneda,
        useAppWeb: s.usaWebApp,
        useAgent: s.usaAgente,
        useStore: s.usaTienda,
        chargeInterest: s.cobraMora,
        chargeType: s.periodoMora,
        interestType: s.tipoMora,
        amount: s.monto,
        percentage: s.porcentaje
      });
    });
    return this.http.post<any>(`${environment.END_POINT}/company/service?_=`+ new Date().getTime(), data)
      .pipe(map(r => {
        this.spinner.hide();
        return r;
      }))
      .pipe(catchError(err => {
        this.spinner.hide();
        throw throwError(err);
      }));

  }
}
