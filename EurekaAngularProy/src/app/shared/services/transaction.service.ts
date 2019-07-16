import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { StorageService } from "./storage.service";
import { Debts, DebtsPagedList } from "../models/debts";
import { Observable, throwError } from "rxjs";
import { catchError, first, map } from "rxjs/operators";
import { DebtEdit } from "../models/debts-edit.model";
import { DebstFilter } from "../models/debts-filter.model";


@Injectable({
    providedIn: 'root'
  }  
)

export class TransactionService {
    private URI_API: string = environment.END_POINT

    constructor(public http: HttpClient, private storage: StorageService)  { }

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

    getDeuda(filtro: DebstFilter): Observable<DebtsPagedList>{
        const url = `${this.URI_API}/debt?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.columnName}&InputSearch=${filtro.inputSearch}&Asc=${filtro.asc}&Service=${filtro.service}&Status=${filtro.status}&DateForFilter=${filtro.dateForFilter}&DateFrom=${this.getDateFormat(filtro.dateFrom)}&DateTo=${this.getDateFormat(filtro.dateTo)}`;
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<DebtsPagedList>(url, opts)
          .pipe<DebtsPagedList>(map(r => {
            r.data.forEach(d => {
              d.emissionDate = new Date(d.emissionDate);
              d.dueDate = new Date(d.dueDate);
              d.edit = false;
            });
            return r;
          }))
          .pipe(catchError(error => throwError(error)));  
    }   
      

       deleteDeuda(idDebt: number): Observable<Debts>{
        console.log('begin login')
        // cambia link
        const url = `${this.URI_API}/debt/${idDebt}`;
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.delete<Debts>(url, opts).pipe(catchError(error => throwError(error)));  
    } 

    deleteAll(ids: number[]): Observable<any> {
      const url = `${this.URI_API}/debt/deleteAll`;
      console.log(url);
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
      };
      return this.http.put<Debts>(url, { ids: ids }, opts).pipe(catchError(error => throwError(error)));  
    }

    editDeuda(id: number, debts: DebtEdit): Observable<any>{
      console.log('begin login')
      // cambia link
      const url = `${this.URI_API}/debt/${id}`;
      console.log(url);
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
      };
      return this.http.put(url, debts ,opts).pipe(catchError(error => throwError(error)));  
    }

    
  
  
}