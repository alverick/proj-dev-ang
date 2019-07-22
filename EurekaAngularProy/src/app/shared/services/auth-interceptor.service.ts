import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string = localStorage.getItem('tk');

    let request = req;

    if(token){
      request = req.clone({
        setHeaders:{
          authorization: `Bearer ${ token }`, 
          ocpApimSubscriptionKey: `3b8700ab20814ee58e07ffc89e16c86`,
          ocpApimTrace: `true`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        if(err.status === 401){
          this.router.navigateByUrl('/login');
        }

        return throwError(err);
      })
    );

  }
}
