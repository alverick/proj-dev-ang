 
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';
import { EnterprisesGtp, EnterprisesPagedList } from '../models/enterprises-gtp';
import { PendingResquest } from '../models/pending-resquest';
import { GtpFilter } from '../models/gtp-filter';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { map, catchError } from 'rxjs/operators';
import { DataEnterpriseGTP } from '../models/data-enterprise-gtp';
import { DataServiceGTP } from '../models/data-service-gtp';
import { GtpEmpresa } from '../models/gtp-post';
 

@Injectable({
  providedIn: 'root'
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT
  public pageMessage: string = "Mostrando 0 de 0 elementos";
  constructor(private http: HttpClient, private storage: StorageService) { }
  public services: DataServiceGTP[] = [];
  public EnterprisesItems: EnterprisesPagedList = { totalCompanies:0, listCompanyGTP: [] };
  public emp :GtpEmpresa;

  private States:StatesGtp [] =[
    {idState: 'Pendiente', descripcion:'pendiente'},
    {idState: 'Resuelto ', descripcion:'resuelto '},
    {idState: 'Devuelto', descripcion:'devuelto'},
  ];
   
   public Service: DataServiceGTP[] = [
 {
    nombre: 'Mensualidad', 
    codDeudor: 'DNI',
    tipoDato: 'C',
    tipoPago: 'C',
    idCuenta: 2,
    nroCuenta: '*********7653 (dolares)',
    moneda: '001',
    simboloMoneda: 'S/',
    usaWebApp: true,
    usaAgente: false,
    usaTienda: true,
    cobraMora: 'S',
    periodoMora: '2',
    tipoMora: 'M',
    monto:12.2,
    pagoPartes: 'S',
    Status:'nuevo Servicio',
    NewNameCod: null,
    NewName: null
   },{
    nombre: 'Mensualidad2', 
    codDeudor: 'DNI',
    tipoDato: 'P',
    tipoPago: 'P',
    idCuenta: 2,
    nroCuenta: '*********7653 (dolares)',
    moneda: '001',
    simboloMoneda: 'S/',
    usaWebApp: true,
    usaAgente: false,
    usaTienda: true,
    cobraMora: 'S',
    periodoMora: '2',
    tipoMora: 'M',
    monto:12.2,
    pagoPartes: 'S',
    Status:'nuevo Servicio',
    NewNameCod: null,
    NewName: null
   },{
    nombre: 'Mensualidad3', 
    codDeudor: 'DNI',
    tipoDato: 'C',
    tipoPago: 'C',
    idCuenta: 2,
    nroCuenta: '*********7653 (dolares)',
    moneda: '001',
    simboloMoneda: 'S/',
    usaWebApp: true,
    usaAgente: false,
    usaTienda: true,
    cobraMora: 'N',
    periodoMora: '2',
    tipoMora: 'M',
    monto:12.2,
    pagoPartes: 'S',
    Status:'nuevo Servicio',
    NewNameCod: null,
    NewName: null
   }
  ]

  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 
 
  //opcional
  getEmpresas(filtro: GtpFilter = null):Observable<EnterprisesPagedList>{  
    // si es nulo que aplique el ultimo filtro
    if (filtro === null) {
      filtro = this.lastFilter;
    }else{
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
        .pipe(map (r =>{ 
          this.EnterprisesItems = r;
          return r; 
        })) 
        .pipe(map(r => {
          if (r.totalCompanies == 0) {
            this.pageMessage = "Mostrando 0 de 0 elementos";
          }
          else {
                      // (1 - 1*50)+1 =1
            let beg = ((filtro.pageNumber - 1) * 50) + 1;
                        // 1*50=50
            let end = filtro.pageNumber * 50;
              // 50 > 150
            if (end > r.totalCompanies)
              end = r.totalCompanies;
              // Mostrando 1 - 50 de 150 elemtos
            this.pageMessage = `Mostrando ${beg} - ${end} de ${r.totalCompanies} elementos`;
          }
          return r;
        }))
        .pipe(catchError(error => throwError(error))); 
   }
 
   GetEnterpriseGtp(id:any):Observable<DataEnterpriseGTP>{ 
      const url = `${environment.END_POINT}/company/GTP/client?ClientId=${id}&_=`+ new Date().getTime();
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      }; 
      return this.http.get<DataEnterpriseGTP>(url, opts)
      .pipe(map(r => {  
        return r;
      }))
      .pipe(catchError(err => throwError(err))); 

  } 
  
   GetServicesGtp (id:any){ 
    const url = `${environment.END_POINT}/services?ClienteId=${id}&_=`+ new Date().getTime();
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    }; 
    this.http.get<any[]>(url,opts).subscribe(d=> {
      let servicios = [];
      d.forEach(s => {
        servicios.push({
          id: s.id,
          nombre: s.name,
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
          pagoPartes: s.partialPayment,
          Status: s.status  ,
          NewNameCod: s.NewNameCod,
          NewName: s.NewName
        });
      });
      this.services = servicios;
    });
   }  


  


}
