import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment"; 
import { RespuestaLogin } from "../models/respuestaLogin.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
}
)

export class LoginService {

constructor(public http: HttpClient, private storage: StorageService,
  private router: Router){ }

private URI_API: string = environment.END_POINT;
public errores: number;


login(ruc: string, psw: string): Observable<RespuestaLogin> {
  console.log('begin login' )
  const url = `${this.URI_API}/login`;
  const data = `username=${ruc}&password=${psw}`;
  console.log(url, data);
  const opts = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  };
  return this.http.post(url, data, opts)
    .pipe(map((r: RespuestaLogin) => {
      console.log(r);
      this.storage.setCurrentSession({
        user: { ruc: ruc },
        isAuthenticate: true,
        token: r.paramStr
      });
      /*r.paramStr = null;*/
      return r;
    }));
 }

logout(): void {
  const url = `${this.URI_API}/login/out`;
  this.http.post(url, {})
    .subscribe(() => {
      this.storage.removeCurrentSession();
      this.router.navigate(['/login']);
    });
}

}
