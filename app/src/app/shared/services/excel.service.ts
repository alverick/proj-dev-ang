import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type StatusValues } from '../constants/process';
import { type CompanyServices } from '../models/company';
import { type IErrorObj } from '../models/error.model';
import { LoginService } from './login.service';

export interface ProcessStatus {
  status: StatusValues;
  errors: IErrorObj[];
  rowsUploaded: number;
  rowsRejected: number;
  advance: number;
  phase: number;
}

export interface LastProcessStatus {
  id: number;
  status: StatusValues;
  advance: number;
  phase: number;
}

export type LoadFileProcess = {
  idProcess: number;
};

@Injectable()
export class ExcelService {
  http = inject(HttpClient);

  private readonly URI_API: string = environment.END_POINT;
  readonly #isProcessActive = signal<boolean>(false);
  public readonly isProcessActive = this.#isProcessActive.asReadonly();
  public service: Partial<CompanyServices> = null;
  public idProcess = 0;
  public errores: IErrorObj[] = [];

  constructor() {
    const loginService = inject(LoginService);

    effect(() => {
      const isLoggedIn = loginService.isAuthenticated();
      if (!isLoggedIn) {
        this.resetProcessState();
      }
    });
  }

  startUpload(id?: number) {
    if (id !== undefined) {
      this.idProcess = id;
    }
    this.#isProcessActive.set(true);
  }

  resetProcessState() {
    this.#isProcessActive.set(false);
    this.idProcess = 0;
    this.errores = [];
  }

  UploadExcel(files: File[]) {
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${this.service.name}`;
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<LoadFileProcess>(url, formData)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  confirmUser(files: File[]) {
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${this.service.name}/${this.idProcess}`;
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<LoadFileProcess>(url, formData)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  StatusExcel(id: number): Observable<ProcessStatus> {
    const url = `${this.URI_API}/debt/process/${id}/status`;
    return this.http
      .get<ProcessStatus>(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  GetTemplate(): Observable<Blob> {
    const serviceName = encodeURIComponent(this.service.name);
    const url = `${this.URI_API}/debt/template?service=${serviceName}`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  GetLastProcess() {
    const url = `${this.URI_API}/debt/process/last`;
    return this.http.get<LastProcessStatus>(url);
  }
}
