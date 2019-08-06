import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string = localStorage.getItem('tk');

    let request = req;

    let headers = {
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
        localStorage.removeItem('tk');
        this.router.navigateByUrl('/login');
        }if(err.status === 500){
        localStorage.removeItem('tk');
        this.router.navigateByUrl('/login');
        }
        return throwError(err);
      })
    );

  }
}
