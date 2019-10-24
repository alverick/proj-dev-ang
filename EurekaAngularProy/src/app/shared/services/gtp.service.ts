 
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
 

@Injectable({
  providedIn: 'root'
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT
  public pageMessage: string = "Mostrando 0 de 0 elementos";
  constructor(private http: HttpClient, private storage: StorageService) { }

  public EnterprisesItems: EnterprisesPagedList = { totalCompanies:0, listCompanyGTP: [] };

  private States:StatesGtp [] =[
    {idState: 'Pendiente', descripcion:'pendiente'},
    {idState: 'Resuelto ', descripcion:'resuelto '},
    {idState: 'Devuelto', descripcion:'devuelto'},
  ];
 

  public PendingResqs: PendingResquest[] = [
      {idSolicitud:2,type:0,texto:'DatosEmpresa', state:'por revisar', 
      checkFields:[{NombreCampo:'Nombre de la Empresa', Campo:'Colegio de Ing de Peru', aprobado:false}]},
      {idSolicitud:2,type:1,texto:'Servicio Demo1', state:'por revisar', 
      checkFields:[{NombreCampo:'Nombre del Servicio1', Campo:'Mensualidad', aprobado:false}, {NombreCampo:'Codigo Deudor', Campo:'Cod Alumno', aprobado:false}]},
      {idSolicitud:3,type:1,texto:'Servicio Demo2', state:'por revisar',
      checkFields:[{NombreCampo:'Nombre del Servicio2', Campo:'Mensualidad', aprobado:false}]},  
     
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

  getPendingResquest():Observable<PendingResquest[]>{
    return of(this.PendingResqs);
  }

}
