import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { CompanyServices } from '../models/company';
import { IErrorObj } from '../models/error.model';

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
  private URI_API: string = environment.END_POINT;
  public statusUpload = false;

  constructor(public http: HttpClient) {}

  public service: Partial<CompanyServices> = {};
  public idProcess = 0;
  public errores: IErrorObj[] = [];

  UploadExcel(
    files: any,
    service: string,
    changeStatus: boolean
  ): Observable<any> {
    this.statusUpload = changeStatus;
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${service}`;
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<any>(url, formData)
      .pipe(catchError((error) => throwError(error)));
  }

  StatusExcel(id: number): Observable<ProcessStatus> {
    const url = `${this.URI_API}/debt/process/${id}/status`;
    return this.http
      .get<ProcessStatus>(url)
      .pipe(catchError((error) => throwError(error)));
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
        if (result.status !== 'COMPLETED' && result.status !== 'REJECTED') {
          this.statusUpload = true;
          this.idProcess = result.id;
        }
        return result;
      })
    );
  }
}
