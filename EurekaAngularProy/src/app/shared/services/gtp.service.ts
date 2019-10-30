
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
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT
  public pageMessage: string = "Mostrando 0 de 0 elementos";

  constructor(private http: HttpClient, private storage: StorageService, private spinner: NgxSpinnerService) { }

  public services: DataServiceGTP[] = [];
  public Service : DataServiceGTP;
  public EnterprisesItems: EnterprisesPagedList = { totalCompanies:0, listCompanyGTP: [] };
  public emp :GtpEmpresa;
  public llave:number;

  private States:StatesGtp [] =[
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
              // Mostrando 1 - 50 de 150 elemtos
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
        return r;
      }))
      .pipe(catchError(err => throwError(err)));

  }

   GetServicesGtp (id:any){
    const url = `${environment.END_POINT}/company/GTP/services/${id}/${true}`;
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    };
    this.http.get<any[]>(url,opts).subscribe(d=> {
      let servicios = [];
      d.forEach(s => {
        servicios.push({
          id: s.id,
          name: s.name,
          debtorCode: s.debtorCode,
          dataType: s.dataType,
          paymentType: s.paymentType,
          idAccount: s.idAccount,
          accountNumber: s.accountNumber,
          currency: s.currency,
          usaWebApp: s.useAppWeb,
          usaAgente: s.useAgent,
          usaTienda: s.useStore,
          partialPayment: s.partialPayment,
          chargeInterest: s.chargeInterest,
          chargeType: s.chargeType.toString(),
          interestType: s.interestType,
          amount: s.amount,
          porcentage: s.percentage,
          currencySymbol: s.currencySymbol,
          inReview: s.inReview,
          newNameCode: s.newNameCode,
          newName: s.newName,
          status: s.status,
          acceptednewNameCode: null,
          acceptednewName: null
        });
      });
       this.services = servicios;
      console.table( this.services);
    });
   }

   public Registrar(data: any): Observable<any> {
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








}
