import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { GoogleAnalytics } from './googleAnalytics.service';
import { LoginService } from './login.service';
import { drawPopup } from './popups';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private login: LoginService,
    private storage: StorageService,
    private gaService: GoogleAnalytics
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

    let headers = {
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

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        this.gaService.sendException(err);
        if (!request.url.includes('notification')) {
          if (err.status === 401) {
            this.storage.removeCurrentSession();
            this.snackBar.dismiss();
            Swal.fire({
              title: 'Su sesión ha sido cerrada por inactividad',
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup,
              onClose: () => {
                location.href = authFullRoutingNames.LOGIN;
              },
            });
          } else if (err.status !== 400) {
            this.storage.removeCurrentSession();
            this.snackBar.dismiss();
            Swal.fire({
              title: 'Ha ocurrido un error en el servidor',
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup,
              onClose: () => {
                location.href = authFullRoutingNames.LOGIN;
              },
            });
          }
        }
        return throwError(err);
      })
    );
  }
}
