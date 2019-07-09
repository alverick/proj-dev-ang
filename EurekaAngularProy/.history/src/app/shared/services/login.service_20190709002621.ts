import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { RespuestaLogin } from "../models/respuestaLogin.model";
import { catchError, map } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { StorageService } from "./storage.service";


@Injectable({
  providedIn: 'root'
}  
)

export class LoginService {


constructor(public http: HttpClient, private storage: StorageService)  { }

private URI_API: string = environment.END_POINT

login(ruc: string, psw: string): Observable<RespuestaLogin>{
  console.log('begin login')
  const url = `${this.URI_API}/login`;
  const data = { username: ruc, password: psw };
  console.log(url, data);
  return this.http.post(url, data, { headers: { "Content-Type": "application/x-www-form-urlencoded" }})
    .pipe(map((r: RespuestaLogin) => { 
      console.log(r);
      this.storage.setCurrentSession({ 
        user: { ruc: ruc },
        isAuthenticate: true,
        token: r.paramStr 
      });
      return r;
    }));  
 }    

}
