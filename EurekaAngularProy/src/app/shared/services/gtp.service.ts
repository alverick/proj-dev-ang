 
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';
import { EnterprisesGtp } from '../models/enterprises-gtp';
import { PendingResquest } from '../models/pending-resquest';
import { GtpFilter } from '../models/gtp-filter';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { map, catchError } from 'rxjs/operators';
 

@Injectable({
  providedIn: 'root'
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT
  public pageMessage: string = "Mostrando 0 de 0 elementos";
  constructor(private http: HttpClient, private storage: StorageService) { }

  private States:StatesGtp [] =[
    {idState: 'Pendiente', descripcion:'pendiente'},
    {idState: 'Resuelto ', descripcion:'resuelto '},
    {idState: 'Devuelto', descripcion:'devuelto'},
  ];

 
  public Empresas: EnterprisesGtp[] = [
    {ClientId:'4', RequestDate: new Date(Date.now()),Ruc:'20000000017', Cu:'20',BusinessHeading: 'Colegio',
       NameEnterprises:'Demo Empresa4',Status:'pendiente',requestType:[{type:1,texto:'EMP'},{type:2,texto:'2 SERV'}] },
    { ClientId:'1', RequestDate: new Date(Date.now()),Ruc:'20000000018', Cu:'20',BusinessHeading: 'Colegio',
       NameEnterprises:'Demo Empresa0',Status:'pendiente',requestType:[{type:0,texto:'Nueva Empresa 2 servicios',}] },
       {ClientId:'2', RequestDate: new Date(Date.now()),Ruc:'20000000019', Cu:'20',BusinessHeading: 'Transporte',
       NameEnterprises:'Demo Empresa2',Status:'resuelto',requestType:[{type:1,texto:'EMP'},{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       {ClientId:'3', RequestDate: new Date(Date.now()),Ruc:'20000000020', Cu:'20',BusinessHeading: 'Venta',
       NameEnterprises:'Demo Empresa3',Status:'resuelto',requestType:[{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       
  ];
 

  public PendingResqs: PendingResquest[] = [
     /*{idSolicitud:2,type:0,texto:'DatosEmpresa', state:'por revisar', 
     checkFields:[{NombreCampo:'Nombre de la Empresa', Campo:'Colegio de Ing de Peru', aprobado:false}]},
     {idSolicitud:2,type:1,texto:'Servicio Demo1', state:'por revisar', 
     checkFields:[{NombreCampo:'Nombre del Servicio1', Campo:'Mensualidad', aprobado:false}, {NombreCampo:'Codigo Deudor', Campo:'Cod Alumno', aprobado:false}]},
     {idSolicitud:3,type:1,texto:'Servicio Demo2', state:'por revisar',
     checkFields:[{NombreCampo:'Nombre del Servicio2', Campo:'Mensualidad', aprobado:false}]}, */
     
   ]
  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 


  getEnterprisesGtp():Observable<EnterprisesGtp[]>{
    console.table(this.Empresas);
    return of(this.Empresas)
  }  

  //opcional
  getEmpresas(filtro: GtpFilter = null):Observable<EnterprisesGtp[]>{
    // si es nulo que aplique el ultimo filtro
    if (filtro === null) {
      filtro = this.lastFilter;
    }else{
      this.lastFilter = filtro;
    }
    var strDateFrom = (filtro.dateFrom === null ? '' : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD')));
    var strDateTo = (filtro.dateTo === null ? '' : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD')));
    //fechas


      if (filtro.BusinessHeading === null || filtro.BusinessHeading === undefined)
        filtro.BusinessHeading = '';
      if (filtro.status === null || filtro.status === undefined)
        filtro.status = ''; 
        /*
        pageNumber : number;
    columnName : string;
    asc : boolean;
    inputSearch  : String;
    BusinessHeading: String;
    status: String;
    dateFrom?: Date;
    dateTo?: Date;
         */
        const url = `${this.URI_API}/gtp?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.columnName}&InputSearch=${filtro.inputSearch}&Asc=${filtro.asc}&Status=${filtro.status}&DateFrom=${strDateFrom}&DateTo=${strDateTo}&_=`+ new Date().getTime();   
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };

        return this.http.get<EnterprisesGtp[]>(url, opts)
        .pipe(map (r =>{
          return r;
        }))
        .pipe(map (r =>{
          if(r.length == 0){
            this.pageMessage = "Mostrando 0 de 0 elementos";
          }
          return r;
        }))
        .pipe(catchError(error => throwError(error)));

   }

  getPendingResquest():Observable<PendingResquest[]>{
    return of(this.PendingResqs);
  }

}
