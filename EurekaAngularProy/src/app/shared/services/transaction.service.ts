import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { StorageService } from "./storage.service";
import { Debts } from "../models/debts";
import { Observable, throwError } from "rxjs";
import { catchError, first } from "rxjs/operators";
import { DebstEdit } from "../models/debts-edit.model";


@Injectable({
    providedIn: 'root'
  }  
)

export class TransactionService {
    private URI_API: string = environment.END_POINT

    constructor(public http: HttpClient, private storage: StorageService)  { }


    getDeuda(pagenumber: number, columName: string,
            inputSearch: string, asc: boolean, service: string, status: boolean,
            dateForFilter: string, dateFrom: Date, Datefor: Date): Observable<Debts[]>{
        console.log('begin login')
        const url = `${this.URI_API}/debt?PageNumber=${pagenumber}&ColumnName=${columName}&InputSearch=${inputSearch}&Asc=${asc}&Service=${service}&Status=${status}&DateForFilter=${dateForFilter}&DateFrom=${dateFrom}`;
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<Debts[]>(url, opts).pipe(catchError(error => throwError(error)));  
    }   
      

       deleteDeuda(idDebt: number): Observable<Debts>{
        console.log('begin login')
        // cambia link
        const url = `${this.URI_API}/movimientos/${idDebt}`;
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.delete<Debts>(url, opts).pipe(catchError(error => throwError(error)));  
    } 

    editDeuda(debts: DebstEdit): Observable<any>{
      console.log('begin login')
      // cambia link
      const url = `${this.URI_API}/movimientos/${debts.idDebt}`;
      console.log(url);
      const opts = {
        headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
      };
      return this.http.put(url, debts ,opts).pipe(catchError(error => throwError(error)));  
    }

    
  
  
}