import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';
import { LoginService } from './login.service';
import { StorageService } from './storage.service';
import { drawPopup } from './popups';
import { GoogleAnalytics } from './googleAnalytics.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, public snackBar: MatSnackBar, private login: LoginService,
    private storage: StorageService, private gaService: GoogleAnalytics) { }

  intercept(req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    this.login.refresh();
    const token: string = localStorage.getItem('tk');

    let request = req;

    let headers = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": `true`
    };

    if(token){
      headers["Authorization"] = `bearer ${token}`
    }
      request = req.clone({
      setHeaders: headers
    });

    return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse)=>{
        this.gaService.sendException(err);
        if (!request.url.includes('notification')) {
          if(err.status === 401){
            this.storage.removeCurrentSession();
            this.snackBar.dismiss();
            Swal.fire({
              title: 'Su sesión ha sido cerrada por inactividad',
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText:  'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup,
              onClose: () =>{
                location.href = '/login';
              }
            });
          } else if (err.status !== 400) {
            this.storage.removeCurrentSession();
            this.snackBar.dismiss();
            Swal.fire({
              title: 'Ha ocurrido un error en el servidor',
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText:  'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup,
              onClose: () =>{
                //this.router.navigateByUrl('/login')
                location.href = '/login';
              }
            })
          }
        }
        return throwError(err);
      })
    );

  }
}
