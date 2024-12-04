import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type CompanyServices } from '../models/company';
import { type IErrorObj } from '../models/error.model';

export type StatusValues =
  | 'CREATED'
  | 'VALIDATED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'VALIDATING'
  | 'SAVING';

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

@Injectable()
export class ExcelService {
  private readonly URI_API: string = environment.END_POINT;
  public statusUpload = false;
  public service: Partial<CompanyServices> = null;
  public idProcess = 0;
  public errores: IErrorObj[] = [];

  constructor(public http: HttpClient) {}

  UploadExcel(files: File[], service: string, changeStatus: boolean) {
    this.statusUpload = changeStatus;
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${service}`;
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<any>(url, formData)
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

  GetLastProcess(): Observable<LastProcessStatus> {
    const url = `${this.URI_API}/debt/process/last`;
    return this.http.get<LastProcessStatus>(url).pipe(
      map((result) => {
        if (
          result.status !== 'COMPLETED' &&
          result.status !== 'REJECTED' &&
          result.status !== 'FAILED'
        ) {
          this.statusUpload = true;
          this.idProcess = result.id;
        }
        return result;
      }),
    );
  }
}
