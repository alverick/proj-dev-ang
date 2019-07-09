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
  const url = `${this.URI_API}/Login/in/${ruc}/${psw}`;
  return this.http.get<RespuestaLogin>(url).pipe(
    catchError(error => throwError(error))
  );  
 }    


/*
  return this.http.get<Respuesta>(this.baseUrl, {[ruc]: ruc, [psw]: psw});  


login(ruc: string, psw: string){
  return this.http.get(this.baseUrl, {[ruc]: ruc, [psw]: psw});  
 }*/    

  /*
  private basePath = '/api/authenticate/';
  
    login(loginObj: LoginObject): Observable<Session> {
      return this.http.post<Session>(this.basePath + 'login', loginObj);
    }
  
    logout(): Observable<Boolean> {
      return this.http.post<Boolean>(this.basePath + 'logout', {});
    }
*/
 
  

}
