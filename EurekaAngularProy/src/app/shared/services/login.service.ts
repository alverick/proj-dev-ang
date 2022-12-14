import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { RespuestaLogin } from '../models/respuestaLogin.model';
import { GoogleAnalytics } from './googleAnalytics.service';
import { NotifyService } from './notify.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    public http: HttpClient,
    private storage: StorageService,
    private router: Router,
    private notify: NotifyService,
    private gaService: GoogleAnalytics
  ) {}

  private URI_API: string = environment.END_POINT;
  public errores: number;

  private callingRefresh = false;

  login(ruc: string, psw: string): Observable<RespuestaLogin> {
    this.notify.clear();
    const url = `${this.URI_API}/login`;
    const data = `username=${ruc}&password=${psw}`;
    const opts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
    };

    return this.http
      .post(url, data, opts)
      .pipe(
        map((r: RespuestaLogin) => {
          if (r.estado) {
            this.storage.setCurrentSession({
              user: { ruc },
              isAuthenticate: true,
              token: r.paramStr,
              expire: r.exp,
              refresh: r.rfs,
              prfl: r.prfl,
            });
            this.gaService.sendEvent('login', { method: 'OAUTH' });
            if (this.storage.isValidSession()) {
              this.notify.iniciar();
            }
          } else {
            this.gaService.sendEvent('exception', {
              description: 'No Login',
              fatal: false,
            });
          }
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          this.gaService.sendException(err);
          return throwError(err);
        })
      );
  }

  logout(): void {
    const url = `${this.URI_API}/login/out`;
    this.http.post(url, {}).subscribe(() => {
      this.storage.removeCurrentSession();
      this.router.navigate([authFullRoutingNames.LOGIN]);
    });
  }

  refresh(): void {
    if (this.callingRefresh === false) {
      const now = new Date();
      const storage = this.storage.getCurrentSession();
      if (storage) {
        const exp = new Date(storage.expire);
        const rfs = new Date(storage.refresh);
        if (now > rfs && now < exp) {
          this.callingRefresh = true;
          const url = `${this.URI_API}/login`;
          this.http.get(url, {}).subscribe((r: RespuestaLogin) => {
            const storageSession = this.storage.getCurrentSession();
            this.storage.setCurrentSession({
              user: storageSession.user,
              isAuthenticate: true,
              token: r.paramStr,
              expire: r.exp,
              refresh: r.rfs,
              prfl: r.prfl,
            });
            this.callingRefresh = false;
            return r;
          });
        } else {
          this.callingRefresh = false;
        }
      }
    }
  }

  public getCompanyDataUpdate(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/dencrypt`, data)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
