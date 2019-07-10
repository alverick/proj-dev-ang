import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { RespuestaLogin } from "../models/respuestaLogin.model";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
}  
)

export class LoginService {


constructor(public http: HttpClient)  { }

private URI_API: string = environment.END_POINT

login(ruc: string, psw: string): Observable<RespuestaLogin>{
  const url = `${this.URI_API}/login`;
  const data = `username=${ruc}&password=${psw}`
  return this.http.post<RespuestaLogin>(url, data).pipe(
    catchError(error => throwError(error))
  );  
 }    

}
