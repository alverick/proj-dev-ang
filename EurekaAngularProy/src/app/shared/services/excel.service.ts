import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IErrorObj } from '../models/error.model';

@Injectable()
export class ExcelService {
  private URI_API: string = environment.END_POINT;
  public statusUpload = false;

  constructor(public http: HttpClient) {}

  public service: any = '';
  public idProcess = 0;
  public errores: IErrorObj[] = [];

  UploadExcel(
    files: any,
    service: string,
    changestatus: boolean
  ): Observable<any> {
    this.statusUpload = changestatus;
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${service}`;
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<any>(url, formData)
      .pipe(catchError((error) => throwError(error)));
  }

  StatusExcel(id: number): Observable<any> {
    const url = `${this.URI_API}/debt/process/${id}/status`;
    return this.http
      .get<any>(url)
      .pipe(catchError((error) => throwError(error)));
  }

  GetTemplate(): Observable<Blob> {
    const serviceName = encodeURIComponent(this.service.name);
    const url = `${this.URI_API}/debt/template?service=${serviceName}`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  GetLastProcess(): Observable<any> {
    const url = `${this.URI_API}/debt/process/last`;
    return this.http.get<any>(url).pipe(
      map((v) => {
        if (v.status !== 'COMPLETED' && v.status !== 'REJECTED') {
          this.statusUpload = true;
          this.idProcess = v.id;
        }
        return v;
      })
    );
  }
}
