import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface TokenChangePassword {
  TokenEncrypted: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecuperaService {
  constructor(private http: HttpClient) {}

  public ruc: number;
  public email: number;

  public RecoverPassword(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/Verifying`, data)
      .pipe(
        map((r) => {
          this.ruc = data.RUC;
          this.email = data.Email;
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public VerifingToken(data: TokenChangePassword): Observable<boolean> {
    return this.http
      .post<boolean>(`${environment.END_POINT}/Login/dencrypt`, data)
      .pipe(
        map((r) => {
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public ChangePassword(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/changepassword`, data)
      .pipe(
        map((r) => {
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
