import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import { Debts, DebtsPagedList } from "../models/debts";
import { Observable, throwError } from "rxjs";
import { catchError,  map } from "rxjs/operators";
import { DebtEdit } from "../models/debts-edit.model";
import { DebstFilter } from "../models/debts-filter.model";
import * as moment from "moment";


@Injectable({
    providedIn: 'root'
  }
)

export class TransactionService {
    private URI_API: string = environment.END_POINT
    private lastFilter: DebstFilter = null;

    constructor(public http: HttpClient, private storage: StorageService)  { }

    public pageMessage: string = "Mostrando 0 de 0 elementos";
    public debtItems: DebtsPagedList = { count:0, data: [] };
    public itemsForDelete: number[] = [];

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

    //opcional
    getDeuda(filtro: DebstFilter = null): Observable<DebtsPagedList>{
      // ultimo filtro aplicado
      if (filtro === null) {
        filtro = this.lastFilter;
      }
      else {
        // el nuevo filtro
        this.lastFilter = filtro;
      }

      var strDateFrom = (filtro.dateFrom === null ? '' : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD')));
      var strDateTo = (filtro.dateTo === null ? '' : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD')));
      //fechas

      if (filtro.service === null || filtro.service === undefined)
        filtro.service = '';
      if (filtro.status === null || filtro.status === undefined)
        filtro.status = '';
      if (filtro.dateForFilter === null || filtro.dateForFilter === undefined)
        filtro.dateForFilter = '';

        const url = `${this.URI_API}/debt?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.columnName}&InputSearch=${filtro.inputSearch}&Asc=${filtro.asc}&Service=${filtro.service}&Status=${filtro.status}&DateForFilter=${filtro.dateForFilter}&DateFrom=${strDateFrom}&DateTo=${strDateTo}&_=`+ new Date().getTime();
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<DebtsPagedList>(url, opts)
          .pipe<DebtsPagedList>(map(r => {
            r.data.forEach(d => {
              d.emissionDate = new Date(d.emissionDate);
              if (d.dueDate !== null && d.dueDate !== undefined)
                d.dueDate = new Date(d.dueDate);
              d.editInput = false;
              d.editButton = false;
              d.newStatus = '1';
              d.errores = {};
              d.selected = (this.itemsForDelete.indexOf(d.id) >= 0);
            });
            this.debtItems = r;
            return r;
          }))
          .pipe(map(r => {
            if (r.count == 0) {
              this.pageMessage = "Mostrando 0 de 0 elementos";
            }
            else {
              let beg = ((filtro.pageNumber - 1) * 50) + 1;
              let end = filtro.pageNumber * 50;
              if (end > r.count)
                end = r.count;
              this.pageMessage = `Mostrando ${beg} - ${end} de ${r.count} elementos`;
            }
            return r;
          }))
          .pipe(catchError(error => throwError(error)));
    }


  deleteDeuda(idDebt: number): Observable<Debts>{
      // cambia link
      const url = `${this.URI_API}/debt/${idDebt}?_=`+ new Date().getTime();
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
      };
      return this.http.delete<Debts>(url, opts).pipe(catchError(error => throwError(error)));
  }

  deleteAll(): Observable<any> {
    const url = `${this.URI_API}/debt/deleteAll?_=`+ new Date().getTime();
    const opts = {
      headers: { "Authorization": "bearer " + this.storage.getCurrentToken()}
    };
    return this.http.put<Debts>(url, { ids: this.itemsForDelete }, opts).pipe(catchError(error => throwError(error)));
  }

  deleteFiltered(filtro: DebstFilter = null) {
    if (filtro === null) {
      filtro = this.lastFilter;
    }
    var strDateFrom = (filtro.dateFrom === null ? '' : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD')));
    var strDateTo = (filtro.dateTo === null ? '' : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD')));
    //fechas

    if (filtro.service === null || filtro.service === undefined)
      filtro.service = '';
    if (filtro.status === null || filtro.status === undefined)
      filtro.status = '';
    if (filtro.dateForFilter === null || filtro.dateForFilter === undefined)
      filtro.dateForFilter = '';

    const url = `${this.URI_API}/debt/deleteFiltered?InputSearch=${filtro.inputSearch}&Service=${filtro.service}&Status=${filtro.status}&DateForFilter=${filtro.dateForFilter}&DateFrom=${strDateFrom}&DateTo=${strDateTo}&_=`+ new Date().getTime();
    return this.http.delete<Debts>(url).pipe(catchError(error => throwError(error)));
  }

  // ESITAR LA DEUDA
    editDeuda(id: number, debts: DebtEdit): Observable<any>{
      // cambia link
      const url = `${this.URI_API}/debt/${id}?_=`+ new Date().getTime();;
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
      };
      return this.http.put(url, debts ,opts).pipe(catchError(error => throwError(error)));
    }

    report(filtro: DebstFilter): Observable<any>{
      const url = `${this.URI_API}/debt/report?_=`+ new Date().getTime();
      const headers = new HttpHeaders({
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
      return this.http.post(url, fltr, {
        headers: headers,
        responseType: 'blob'
      })
        .pipe(catchError(err => throwError(err)));
    }

    updateDeuda(id: number, paid: boolean): Observable<any>{
      const url = `${this.URI_API}/debt/pay?_=`+ new Date().getTime();
      const opts={
        headers: { "Authorization":"bearer" + this.storage.getCurrentToken()}
      };
      const data ={
        idDebt : id,
        Payed : paid
      }
      return this.http.post<any>(url, data).pipe(catchError(error => throwError(error)));
    }

  getPayments(debtId: number): Observable<any[]> {
    let url = `${this.URI_API}/payment/ofDebt/${debtId}?_=${new Date().getTime()}`;
    return this.http.get<any[]>(url)
      .pipe(map(p => {
        p.forEach(v => {
          v.editing = false;
          v.errores = {};
        });
        return p;
      }))
      .pipe(catchError(err => throwError(err)));
  }

  addPayment(debtId: number, payment: any): Observable<any> {
    let url = `${this.URI_API}/payment?_=${new Date().getTime()}`;
    payment.debtId = debtId;
    return this.http.post<any>(url, payment)
      .pipe(catchError(err => throwError(err)));
  }

  editPayment(debtId: number, paymentId: number, payment: any): Observable<any> {
    let url = `${this.URI_API}/payment/${paymentId}?_=${new Date().getTime()}`;
    payment.debtId = debtId;
    return this.http.put(url, payment)
      .pipe(catchError(err => throwError(err)));
  }

  deletePayment(debtId: number, paymentId: number): Observable<any> {
    let url = `${this.URI_API}/payment/${paymentId}/ofDebt/${debtId}?_=${new Date().getTime()}`;
    return this.http.delete(url)
      .pipe(catchError(err => throwError(err)));
  }

  deleteDebt(id: number, forDelete: boolean) {
    let index = this.itemsForDelete.indexOf(id);
    if (forDelete) {
      if (index < 0)
        this.itemsForDelete.push(id);
    }
    else {
      if (index >= 0)
        this.itemsForDelete.splice(index, 1);
    }
  }

  clearMarksForDeletes() {
    this.itemsForDelete = [];
  }

  countMarksForDelete() {
    return this.itemsForDelete.length;
  }

  isMarkedAll() {
    let markAll = true;
    this.debtItems.data.forEach(v => {
      let idx = this.itemsForDelete.indexOf(v.id);
      markAll = markAll && (idx >= 0);
    });
    return markAll;
  }
}
