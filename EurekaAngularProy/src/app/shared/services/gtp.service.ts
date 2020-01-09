import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';
import { EnterprisesPagedList } from '../models/enterprises-gtp';
import { GtpFilter } from '../models/gtp-filter';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { map, catchError } from 'rxjs/operators';
import { DataEnterpriseGTP } from '../models/data-enterprise-gtp';
import { DataServiceGTP } from '../models/data-service-gtp';
import { GtpEmpresa } from '../models/gtp-post';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataGTPChange } from '../models/data-gtpchange';
import { ServiceModel } from '../models';


@Injectable({
  providedIn: 'root'
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT
  public pageMessage: string = "Mostrando 0 de 0 elementos";

  constructor(private http: HttpClient, private storage: StorageService, private spinner: NgxSpinnerService) { }
/// para los servicios que estan en eprobacin
  public services: DataServiceGTP[] = [];
  public Service: DataServiceGTP;
  public EnterprisesItems: EnterprisesPagedList = { totalCompanies: 0, listCompanyGTP: [] };
  //public emp: DataGTPChange;
  public llave: string;
  public nombre: string;
  public EdtEmpServ: DataGTPChange;
  public EmpresaServicios: DataEnterpriseGTP;
  private States: StatesGtp [] = [
    {idState: 'Pendiente', descripcion:'pendiente'},
    {idState: 'Resuelto ', descripcion:'resuelto '},
    {idState: 'Devuelto', descripcion:'devuelto'},
  ];

  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  }

  // opcional
  getEmpresas(filtro: GtpFilter = null): Observable<EnterprisesPagedList>{
    // si es nulo que aplique el ultimo filtro
    if (filtro === null) {
      filtro = this.lastFilter;
    } else {
      this.lastFilter = filtro;
    }
    var strDateFrom = (filtro.dateFrom === null ? '' : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD')));
    var strDateTo = (filtro.dateTo === null ? '' : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD')));

      if (filtro.BusinessHeading === null || filtro.BusinessHeading === undefined)
        filtro.BusinessHeading = '';
      if (filtro.status === null || filtro.status === undefined)
        filtro.status = '';
        const url = `${this.URI_API}/Company/GTP/list?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.ColumnName}&Asc=${filtro.asc}&InputSearch=${filtro.inputSearch}&BusinessHeading=${filtro.BusinessHeading}&Status=${filtro.status}&DateFrom=${strDateFrom}&DateTo=${strDateTo}&_=`+ new Date().getTime();
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<EnterprisesPagedList>(url, opts)
        .pipe(map (r => {
          this.EnterprisesItems = r;
          return r;
        }))
        .pipe(map(r => {
          if (r.totalCompanies == 0) {
            this.pageMessage = "Mostrando 0 de 0 elementos";
          } else {
                      // (1 - 1*50)+1 =1
            let beg = ((filtro.pageNumber - 1) * 50) + 1;
                        // 1*50=50
            let end = filtro.pageNumber * 50;
              // 50 > 150
            if (end > r.totalCompanies)
              end = r.totalCompanies;
              // Mostrando 1 - 50 de 1s50 elemtos
            this.pageMessage = `Mostrando ${beg} - ${end} de ${r.totalCompanies} elementos`;
          }
          return r;
        }))
        .pipe(catchError(error => throwError(error)));
   }

   GetEnterpriseGtp(id: any): Observable<DataEnterpriseGTP> {
      const url = `${environment.END_POINT}/company/GTP/client/${id}`;
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
      return this.http.get<DataEnterpriseGTP>(url, opts)
      .pipe(map(r => {
        // console.log('EMPRESA');
         console.log(r);
        return r;

      }))
      .pipe(catchError(err => throwError(err)));
  }

  GetEnterpriseGtp2(id: any): Observable<any> {
    const url = `${environment.END_POINT}/company/GTP/client/${id}`;
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    };
    return this.http.get<any>(url, opts)
    .pipe(map(r => {
      console.log('empresaR');
      console.log( r);
      console.log('end empresaR');
      return r;

    }))
    .pipe(catchError(err => throwError(err)));
}

   GetServicesGtp (id: any) {
    const url = `${environment.END_POINT}/company/GTP/services/${id}/${false}`;
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    };
    this.http.get<any[]>(url, opts).subscribe(d => {
      console.log('SERVICIOS ');
      console.table(d);
      let servicios = [];
      d.forEach(s => {
        servicios.push({
          id: s.id,
          res: s.res,
          name: s.name,
          newName: s.newName,
          newNameCode: s.newNameCode,
          debtorCode: s.debtorCode,
          dataType: s.dataType,
          paymentType: s.paymentType,
          idAccount: s.idAccount,
          accountNumber: s.accountNumber,
          currency: s.currency,
          useAppWeb: s.useAppWeb,
          useAgent: s.useAgent,
          useStore: s.useStore,
          partialPayment: s.partialPayment,
          chargeInterest: s.chargeInterest,
          chargeType: s.chargeType.toString(),
          interestType: s.interestType,
          amount: s.amount,
          porcentage: s.percentage,
          currencySymbol: s.currencySymbol,
          inReview: s.inReview,
          status: s.status,
          acceptednewNameCode: null,
          acceptednewName: null,
          nombreHabilitado :  (s.name === s.newName) ? false : true,
          nombreCodHabilitado :  (s.debtorCode === s.newNameCode) ?  false : true,
          newNameGTPStatus: s.newNameGTPStatus,
          newNameCodeGTPStatus: s.newNameCodeGTPStatus,
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
          pagoPartes: s.partialPayment,
        });
      });
      console.log('SERVICIOS..s');
      console.table(servicios);
       this.services = servicios;

    });
   }

   public AprobarEmpresaServ(data: any): Observable<any> {
    this.spinner.show();
    return this.http.post<any>(`${environment.END_POINT}/company/gtp/approve`, data)
      .pipe(map(r => {
        this.spinner.hide();
        if (r.success) {
        }
        return r;
      }))
      .pipe(catchError(err => {
        this.spinner.hide();
        return throwError(err);
      }));
  }

/*ESTO ME TRAE EN LA CORRECION*/

  public GetEnterpriseServices(data: any): Observable<any> {
     this.spinner.show();
     return this.http.post<any>(`${environment.END_POINT}/Login/dencrypt?_=` + new Date().getTime(), data)
     .pipe(map(r => {
           this.spinner.hide();
           console.log('MACHILON, LOS SERVICIOS TRAEN ESTOs');
           console.log(r);
          return r;
     }))
     .pipe(catchError(err => {
       this.spinner.hide();
      return throwError(err);
     }));
  }



  public EditChangeGTP(data: any) {
    this.spinner.show();
    return this.http.post<any>(`${environment.END_POINT}/company/gtp/client/update`, data)
      .pipe(map(r => {
        this.spinner.hide();
        return r;
      }))
      .pipe(catchError(err => {
        this.spinner.hide();
        return throwError(err);
      }));
  }

  public CrearSevice(): ServiceModel {
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
    let svc: any = {
      id: null,
      nombre: nombre,
      newName : nombre,
      codDeudor: 'DNI',
     // newNameCode: '',
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
      pagoPartes: 'N',
      acceptednewName : null,
      acceptednewNameCode: null,
      inReview: true,
      name: '?',
      debtorCode: '?'
    };
    this.services.push(svc);
    return svc;
  }

  Descartar(indice: number, isNew: boolean) {
    if (isNew && this.services.length > 1 && indice >= 0 && indice === (this.services.length - 1)) {
      let svc = this.services[this.services.length-1];
      if (svc.id === null || svc.id === undefined || svc.id < 0) {
        this.services.pop();
      }
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

  public GrabarServicios(id: number, emp: DataEnterpriseGTP): Observable<any> {
    this.spinner.show();
    const data = { clientId: id, company: emp, services: [], deleted: [] };
    this.services.forEach(s => {
      data.services.push({
        id: s.id,
        res: s.res,
        name: s.nombre ,
        newName: s.newName,
        entry: s.rubro,
        debtorCode: ( s.codDeudor === 'Otro') ? s.nameCod : s.codDeudor ,
        newNameCode: s.newNameCode,
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
        percentage: s.porcentaje,
        partialPayment: s.pagoPartes
      });
    });
    return this.http.post<any>(`${environment.END_POINT}/company/GTP/company/update?_=`+ new Date().getTime(), data)
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
