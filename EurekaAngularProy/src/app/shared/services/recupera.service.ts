import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

interface TokenChangePassword {
  TokenEncrypted: string;
}

@Injectable()
export class RecuperaService {
  constructor(private http: HttpClient) {}

  public ruc: number;
  public email: number;

  public RecoverPassword(data: any) {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/Verifying`, data)
      .pipe(
        map((r) => {
          this.ruc = data.RUC;
          this.email = data.Email;
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public VerifingToken(data: TokenChangePassword) {
    return this.http
      .post<boolean>(`${environment.END_POINT}/Login/dencrypt`, data)
      .pipe(
        map((r) => {
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public ChangePassword(data: any) {
    return this.http
      .post<any>(`${environment.END_POINT}/Login/changepassword`, data)
      .pipe(
        map((r) => {
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
