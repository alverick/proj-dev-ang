import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperaService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  public ruc: number;
  public email: number;

  public RecoverPassword(data: any): Observable<any> {
    this.spinner.show();

     return this.http.post<any>(`${environment.END_POINT}/Login/Verifying?_=` + new Date().getTime(), data)
     .pipe(map(r => {
          this.ruc = data.RUC;
          this.email = data.Email;
          this.spinner.hide();
          return r;
     }))
     .pipe(catchError(err => {
      this.spinner.hide();
      return throwError(err);
     }));
  }

  public VerifingToken(data: any): Observable<any> {
    this.spinner.show();

     return this.http.post<any>(`${environment.END_POINT}/Login/dencrypt?_=` + new Date().getTime(), data)
     .pipe(map(r => {

          this.spinner.hide();
          return r;
     }))
     .pipe(catchError(err => {
      this.spinner.hide();
      return throwError(err);
     }));
  }


  public ChangePassword(data: any): Observable<any> {
    this.spinner.show();
     return this.http.post<any>(`${environment.END_POINT}/Login/changepassword?_=` + new Date().getTime(), data)
     .pipe(map(r => {

          this.spinner.hide();
          return r;
     }))
     .pipe(catchError(err => {
      this.spinner.hide();
      return throwError(err);
     }));
  }


}
