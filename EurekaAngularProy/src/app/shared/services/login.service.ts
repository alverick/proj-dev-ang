import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AppConfigActions } from '../../store/actions/app-config.actions';
import { type RespuestaLogin } from '../models/respuestaLogin.model';
import { NotifyService } from './notify.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    public http: HttpClient,
    private storage: StorageService,
    private notify: NotifyService,
    private store: Store
  ) {}

  private URI_API: string = environment.END_POINT;
  public errores: number;

  private callingRefresh = false;

  login(ruc: string, psw: string): Observable<RespuestaLogin> {
    this.notify.clear();
    const url = `${this.URI_API}/login`;
    const data = new HttpParams().set('username', ruc).set('password', psw);
    const opts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
    };

    return this.http
      .post(url, data.toString(), opts)
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
            if (this.storage.isValidSession()) {
              this.notify.iniciar();
            }
            this.store.dispatch(AppConfigActions.resetConfig());
          }
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  logout() {
    const url = `${this.URI_API}/login/out`;
    return this.http.post(url, {}).pipe(
      tap(() => {
        this.storage.removeCurrentSession();
      })
    );
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
