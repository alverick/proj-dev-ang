import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import { Debts, DebtsPagedList } from "../models/debts";
import { Observable, throwError } from "rxjs";
import { catchError,  map } from "rxjs/operators";
import { DebtEdit } from "../models/debts-edit.model";
import { DebstFilter } from "../models/debts-filter.model";
import { Http, Headers, ResponseContentType } from "@angular/http";
import * as moment from "moment";


@Injectable({
    providedIn: 'root'
  }
)

export class TransactionService {
    private URI_API: string = environment.END_POINT
    private lastFilter: DebstFilter = null;

    constructor(public http: HttpClient, private nativeHttp: Http, private storage: StorageService)  { }

    public pageMessage: string = "Mostrando 0 elementos";
    public debtItems: DebtsPagedList = { count:0, data: [] };

    getDateFormat(date: Date): string {
      if (date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var str = day > 9 ? day.toString() : '0' + day.toString();
        str += '%2F' + (month > 9 ? month.toString() : '0' + month.toString());
        str += '%2F' + year.toString();
        return str;
      }
      return '';
    }

    getDeuda(filtro: DebstFilter = null): Observable<DebtsPagedList>{

      if (filtro === null) {
        filtro = this.lastFilter;
      }
      else {
        this.lastFilter = filtro;
      }


      var strDateFrom = (filtro.dateFrom === null ? '' : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD')));
      var strDateTo = (filtro.dateTo === null ? '' : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD')));
      //fechas
      console.log('fechas');
      console.log(strDateFrom);
      console.log(strDateTo);

      console.log(filtro);
        const url = `${this.URI_API}/debt?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.columnName}&InputSearch=${filtro.inputSearch}&Asc=${filtro.asc}&Service=${filtro.service}&Status=${filtro.status}&DateForFilter=${filtro.dateForFilter}&DateFrom=${strDateFrom}&DateTo=${strDateTo}&_=`+ new Date().getTime();
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<DebtsPagedList>(url, opts)
          .pipe<DebtsPagedList>(map(r => {
            r.data.forEach(d => {
              d.emissionDate = new Date(d.emissionDate);
              d.dueDate = new Date(d.dueDate);
              d.editInput = false;
              d.editButton = false;
              d.newStatus = '1';
            });
            this.debtItems = r;
            console.log(r);
            return r;
          }))
          .pipe(map(r => {
            if (r.count == 0) {
              this.pageMessage = "Mostrando 0 elementos";
            }
            else {
              let beg = ((filtro.pageNumber - 1) * 50) + 1;
              let end = filtro.pageNumber * 50;
              if (end > r.count)
                end = r.count;
              this.pageMessage = `Mostrando de ${beg} - ${end} de ${r.count} elementos`;
            }
            return r;
          }))
          .pipe(catchError(error => throwError(error)));
    }


  deleteDeuda(idDebt: number): Observable<Debts>{
      console.log('begin login')
      // cambia link
      const url = `${this.URI_API}/debt/${idDebt}?_=`+ new Date().getTime();
      console.log(url);
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
      return this.http.delete<Debts>(url, opts).pipe(catchError(error => throwError(error)));
  }

  deleteAll(ids: number[]): Observable<any> {
    const url = `${this.URI_API}/debt/deleteAll?_=`+ new Date().getTime();
    console.log(url);
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    };
    return this.http.put<Debts>(url, { ids: ids }, opts).pipe(catchError(error => throwError(error)));
  }

  // ESITAR LA DEUDA
    editDeuda(id: number, debts: DebtEdit): Observable<any>{
      console.log('begin login')
      // cambia link
      const url = `${this.URI_API}/debt/${id}?_=`+ new Date().getTime();;
      console.log(url);
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
      };
      return this.http.put(url, debts ,opts).pipe(catchError(error => throwError(error)));
    }

    report(filtro: DebstFilter): Observable<any>{
      const url = `${this.URI_API}/debt/report?_=`+ new Date().getTime();
      const headers = new Headers({
        "Authorization": "bearer " + this.storage.getCurrentToken(),
        "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
        "Ocp-Apim-Trace": 'true'
      });
      var strDateFrom = (filtro.dateFrom === null ? '' : moment(filtro.dateFrom).format('YYYY/MM/DD'));
      var strDateTo = (filtro.dateTo === null ? '' : moment(filtro.dateTo).format('YYYY/MM/DD'));
      let fltr = {
        pageNumber: filtro.pageNumber,
        columnName: filtro.columnName,
        asc: filtro.asc,
        inputSearch: filtro.inputSearch,
        service: filtro.service,
        status: filtro.status,
        dateForFilter: filtro.dateForFilter,
        dateFrom: strDateFrom,
        dateTo: strDateTo
      }
      return this.nativeHttp.post(url, fltr, {
        headers: headers,
        responseType: ResponseContentType.Blob
      })
        .pipe(map(r => r.blob()))
        .pipe(catchError(err => throwError(err)));
    }

    updateDeuda(id: number, paid: boolean): Observable<any>{
      const url = `${this.URI_API}/debt/pay?_=`+ new Date().getTime();
      console.log(url);
      const opts={
        headers: { "Authorization":"bearer" + this.storage.getCurrentToken()}
      };
      const data ={
        idDebt : id,
        Payed : paid
      }
      return this.http.post<any>(url, data).pipe(catchError(error => throwError(error)));
    }

}
