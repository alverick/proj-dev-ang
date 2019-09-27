import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RespuestaLogin } from "../models/respuestaLogin.model";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import * as moment from 'moment';
import { GoogleAnalytics } from "./googleAnalytics.service";

@Injectable({
  providedIn: 'root'
}
)

export class LoginService {

constructor(public http: HttpClient, private storage: StorageService,
  private router: Router, private gaService: GoogleAnalytics){ }

private URI_API: string = environment.END_POINT;
public errores: number;

private callingRefresh = false;

login(ruc: string, psw: string): Observable<RespuestaLogin> {
  const url = `${this.URI_API}/login?_=` + new Date().getTime();
  const data = `username=${ruc}&password=${psw}`;
  const opts = {
    headers: { "Content-Type": "application/x-www-form-urlencoded",
    'Cache-Control': 'no-cache',
  }
  };
  return this.http.post(url, data, opts)
    .pipe(map((r: RespuestaLogin) => {
      if (r.estado) {
        this.storage.setCurrentSession({
          user: { ruc: ruc },
          isAuthenticate: true,
          token: r.paramStr,
          expire: r.exp,
          refresh: r.rfs
        });
        this.gaService.sendEvent('login', { method: 'OAUTH' });
      }
      else {
        this.gaService.sendEvent('exception', { description: 'No Login', fatal: false });
      }
      return r;
    }))
    .pipe(catchError(err => {
      this.gaService.sendEvent('exception', { description: err.message, fatal: true });
      return throwError(err);
    }));
 }

logout(): void {
  const url = `${this.URI_API}/login/out?_=` + new Date().getTime();;
  this.http.post(url, {})
    .subscribe(() => {
      this.storage.removeCurrentSession();
      this.router.navigate(['/login']);
    });
}

refresh(): void {
  if (this.callingRefresh === false) {
    let now = new Date();
    let storage = this.storage.getCurrentSession();
    if (storage) {
      let exp = new Date(storage.expire);
      let rfs = new Date(storage.refresh);
      if (now > rfs && now < exp){
        this.callingRefresh = true;
        const url = `${this.URI_API}/login?_=` + new Date().getTime();;
        this.http.get(url,{})
          .subscribe((r: RespuestaLogin)=>{
            let storage = this.storage.getCurrentSession();
            this.storage.setCurrentSession({
              user: storage.user,
              isAuthenticate: true,
              token: r.paramStr,
              expire: r.exp,
              refresh: r.rfs
            });
          this.callingRefresh = false;
          return r;
        })
      }
      else {
        this.callingRefresh = false;
      }
    }
  }
}

}
