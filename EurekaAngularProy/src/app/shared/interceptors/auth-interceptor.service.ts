import {
  type HttpErrorResponse,
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';
import { swalAlert } from '../utils/helpers/popups';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private login: LoginService,
    private storage: StorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes('notification')) {
      this.login.refresh();
    }
    const token: string = sessionStorage.getItem('tk');

    let request = req;

    const headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      'Ocp-Apim-Subscription-Key': environment.OCP_KEY,
      'Ocp-Apim-Trace': `true`,
    };

    if (token) {
      headers['Authorization'] = `bearer ${token}`;
    }
    request = req.clone({
      setHeaders: headers,
    });

    const stringNotAllowed = ['notification', 'https://pro.ip-api.com'];

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const urlNotAllowed = stringNotAllowed.filter((str) =>
          request.url.includes(str)
        );

        if (urlNotAllowed.length < 1) {
          if (err.status === 401) {
            this.storage.removeCurrentSession();
            this.snackBar.dismiss();
            void swalAlert.fire({
              title: 'Su sesión ha sido cerrada por inactividad',
              showCloseButton: true,
              showConfirmButton: true,
              confirmButtonText: 'Cerrar',
              allowOutsideClick: false,
              willClose: () => {
                void this.router.navigate([authFullRoutingNames.LOGIN]);
              },
            });
          } else if (err.status !== 400) {
            this.snackBar.dismiss();
            void swalAlert.fire({
              title: 'Ha ocurrido un error en el servidor',
              showCloseButton: true,
              showConfirmButton: true,
              confirmButtonText: 'Cerrar',
              allowOutsideClick: false,
              willClose: () => {
                void this.router.navigate([authFullRoutingNames.LOGIN]);
              },
            });
          }
        }
        return throwError(err);
      })
    );
  }
}
