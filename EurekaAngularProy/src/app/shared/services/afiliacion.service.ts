import { Injectable, ɵConsole } from "@angular/core";
import { ServiceModel, RubroModel, MonedaModel } from '../models';
import { Observable, throwError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { catchError, map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import { drawPopup } from "./popups";

@Injectable()
export class AfiliacionService {
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService, private storage: StorageService) {}

  public idCompany: number = 0;
  public email:string;
  public Guardado: boolean = false;

  public services: ServiceModel[] = [];



  public Clear() {
    this.Guardado = false;
    this.services.push({
      nombre: 'Mensualidad',
      codDeudor: 'DNI',
      tipoDato: 'C',
      tipoPago: 'C',
      idCuenta: 0,
      nroCuenta: '',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '1',
      tipoMora: 'M',
      pagoPartes: 'N',
    });
  }

  public CrearSevice(): ServiceModel {
    this.Guardado = false;
    let nombre: string = 'Mensualidad';
    let nro = 1;
    this.services.forEach((s, i) => {
      //El startsWith()método determina si una cadena comienza con los caracteres de una cadena especificada. 
      if (s.nombre.toUpperCase().startsWith(nombre.toUpperCase())) {
        if (!isNaN(parseInt(s.nombre.substr(nombre.length))) || s.nombre.substr(nombre.length) === ''){
          let aux = parseInt(s.nombre.substr(nombre.length));
          if (isNaN(aux))
            nro = 2;
          else if (aux >= nro)
            nro = aux + 1;
        }
      }
    });
    if (nro > 1) {
      nombre += nro.toString();
    }
    let svc: ServiceModel = {
      nombre: nombre,
      codDeudor: 'DNI',
      tipoDato: 'C',
      tipoPago: 'C',
      idCuenta: 0,
      nroCuenta: '',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '',
      tipoMora: 'M',
      pagoPartes: 'N'
    };
    this.services.push(svc);
    return svc;
  }

  public AddService(svc: ServiceModel) {
    this.Guardado = false;
    var svc_old = this.services.find((v) => v.nombre === svc.nombre);
    if (svc_old) {
      Swal.fire({
        text: 'Este servicio ya existe',
        allowOutsideClick: false,
        onOpen: drawPopup
      });
    } else {
      this.services.push(svc);
    }
  }

  public DelService(index: number) {
    this.Guardado = false;
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
    this.email = data.email;
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
    return this.http.get<RubroModel[]>(`${environment.END_POINT}/enterpriseHeading?_=` + new Date().getTime())
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
        name: "Tengo sólo código y nombres"
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
        code: '1',
        name: 'Diario'
      },
      {
        code: '2',
        name: 'Fijo'
      }
    ]);
  }

  public GetCards(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.END_POINT}/company/cards?_=${new Date().getTime()}`);
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
        console.log('SERVICIOS DEL SERVICIO');
        console.log(d);
        let servicios = [];
        d.forEach(s => {
          servicios.push({
            id: s.id,
            nombre: s.name,
            newName : s.newName,
            newNameCode : s.newNameCode,
            rubro: s.entry,
            codDeudor: s.debtorCode,
            tipoDato: s.dataType,
            tipoPago: s.paymentType,
            idCuenta: s.idAccount,
            nroCuenta: s.accountNumber, //`${s.accountNumber} (${(s.currency === '001' ? 'soles' : 'dolares' )})`,
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
            inReview: s.inReview,
            pagoPartes: s.partialPayment
          });
        });
        this.services = servicios;
        console.log('TERMINA');
        console.log(this.services);
      });
  }





  public GrabarServicios(): Observable<any> {
    let codigo ;
    console.log('SERVICIOS QUE SE GURADAN EN LOS SERVICES');
    console.table(this.services);
    this.spinner.show();
    const data = { clientId: this.idCompany, services: [], deleted: [] };
    this.services.forEach(s => {
      data.services.push({
        id: s.id,
        name: (s.nombre === '?') ? '' : s.nombre ,
        entry: s.rubro,
        debtorCode: ( s.codDeudor === 'Otro') ? s.nameCod : s.codDeudor ,
        dataType: s.tipoDato,
        paymentType: s.tipoPago,
        idAccount: s.idCuenta,
        accountNumber: s.nroCuenta,
        currency: s.moneda,
        useAppWeb: s.usaWebApp,
        useAgent: s.usaAgente,
        useStore: s.usaTienda,
        chargeInterest: s.cobraMora,
        chargeType: s.periodoMora,
        interestType: s.tipoMora,
        amount: s.monto,
        percentage: s.porcentaje,
        partialPayment: s.pagoPartes
      });
    });
    console.log('SE IMPRIME TODO' );
    console.table(data.services);
    return this.http.post<any>(`${environment.END_POINT}/company/service?_=`+ new Date().getTime(), data)
      .pipe(map(r => {
        this.spinner.hide();
        this.Guardado = true;
        return r;
      }))
      .pipe(catchError(err => {
        this.spinner.hide();
        throw throwError(err);
      }));

  }

  Descartar(indice: number, isNew: boolean) {
    console.log('descartar', isNew);
    this.Guardado = false;
    if (isNew && this.services.length > 1 && indice >= 0 && indice === (this.services.length - 1)) {
      let svc = this.services[this.services.length-1];
      if (svc.id === null || svc.id === undefined || svc.id < 0) {
        this.services.pop();
      }
    }
  }
}
