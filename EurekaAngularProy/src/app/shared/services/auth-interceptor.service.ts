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

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, public snackBar: MatSnackBar, private login: LoginService,
    private storage: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    console.log('intercept');
    this.login.refresh();
    const token: string = localStorage.getItem('tk');

    let request = req;

    let headers = {
      'Cache-Control': 'no-cache',
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": `true`
    };

    if(token){
      headers["Authorization"] = `bearer ${token}`  
    }
      request = req.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        if(err.status === 401){
          this.storage.removeCurrentSession();
          this.snackBar.dismiss();
          this.router.navigateByUrl('/login');
        } else if(err.status === 500){
          this.storage.removeCurrentSession();
          this.router.navigateByUrl('/login');
          this.snackBar.dismiss();
        } else if(!(localStorage.getItem('tk'))){
          this.storage.removeCurrentSession();
          this.snackBar.dismiss();
          Swal.fire({
            imageUrl: '/assets/images/complain.svg',   imageHeight: 100,
            title: 'Su sesión ha sido cerrada por inactividad',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText:  'Cerrar',
            onAfterClose: () =>{
              this.router.navigateByUrl('/login')
            }
          })
        }
        return throwError(err);
      })
    );

  }
}
