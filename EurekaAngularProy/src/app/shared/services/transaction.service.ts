import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { StorageService } from "./storage.service";
import { Debts } from "../models/debts";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  }  
)

export class TransactionService {
    private URI_API: string = environment.END_POINT

    constructor(public http: HttpClient, private storage: StorageService)  { }


    getDeuda(numeroPagina: number): Observable<Debts>{
        console.log('begin login')
        const url = `${this.URI_API}/login?numeroPagina=${numeroPagina}`;
        console.log(url);
        const opts = {
          headers: { "Authorization": "bearer " + this.storage.getCurrentToken() }
        };
        return this.http.get<Debts>(url, opts).pipe(catchError(error => throwError(error)));  
       }   
      
}