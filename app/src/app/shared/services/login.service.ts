import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable, of, throwError } from 'rxjs';
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
  http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly notify = inject(NotifyService);
  private readonly store = inject(Store);

  private readonly URI_API: string = environment.END_POINT;
  public errores: number;

  readonly #isAuthenticated = signal<boolean>(true);
  public readonly isAuthenticated = this.#isAuthenticated.asReadonly();

  login(ruc: string, psw: string, token: string): Observable<RespuestaLogin> {
    this.notify.clear();
    const url = `${this.URI_API}/login`;
    const data = new HttpParams()
      .set('username', ruc)
      .set('password', psw)
      .set('recaptcha', token);
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
            this.#isAuthenticated.set(true);
          }
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  logout() {
    const url = `${this.URI_API}/login/out`;
    return this.http.post(url, {}).pipe(
      tap(() => {
        this.storage.removeCurrentSession();
        this.#isAuthenticated.set(false);
      }),
    );
  }

  refresh(): Observable<RespuestaLogin> {
    const now = new Date();
    const storage = this.storage.getCurrentSession();

    if (storage) {
      const exp = new Date(storage.expire);
      const rfs = new Date(storage.refresh);

      if (now > rfs && now < exp) {
        const url = `${this.URI_API}/login`;
        return this.http.get<RespuestaLogin>(url, {}).pipe(
          tap((r: RespuestaLogin) => {
            const storageSession = this.storage.getCurrentSession();
            this.storage.setCurrentSession({
              user: storageSession.user,
              isAuthenticate: true,
              token: r.paramStr,
              expire: r.exp,
              refresh: r.rfs,
              prfl: r.prfl,
            });
          }),
          catchError((err: HttpErrorResponse) => throwError(() => err)),
        );
      }
    }
    return of({} as RespuestaLogin);
  }

  public getCompanyDataUpdate(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/dencrypt`, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
