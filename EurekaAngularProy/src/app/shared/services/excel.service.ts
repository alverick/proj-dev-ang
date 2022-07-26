import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Error } from '../models/error.model';
import { StorageService } from './storage.service';

@Injectable()
export class ExcelService {
  private URI_API: string = environment.END_POINT;
  public statusUpload = false;

  constructor(public http: HttpClient, private storage: StorageService) {}

  public service: any = '';
  public idProcess = 0;
  public errores: Error[] = [];

  UploadExcel(
    files: any,
    service: string,
    changestatus: boolean
  ): Observable<any> {
    this.statusUpload = changestatus;
    this.errores = [];
    const url =
      `${this.URI_API}/debt/load/${service}?_=` + new Date().getTime();
    const opts = {
      headers: {
        Authorization: 'bearer ' + this.storage.getCurrentToken(),
        'Ocp-Apim-Subscription-Key': environment.END_POINT,
        'Ocp-Apim-Trace': 'true',
      },
    };
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http
      .post<any>(url, formData, opts)
      .pipe(catchError((error) => throwError(error)));
  }

  StatusExcel(id: number): Observable<any> {
    const url =
      `${this.URI_API}/debt/process/${id}/status?_=` + new Date().getTime();
    const opts = {
      headers: {
        Authorization: 'bearer ' + this.storage.getCurrentToken(),
        'Ocp-Apim-Subscription-Key': environment.OCP_KEY,
        'Ocp-Apim-Trace': 'true',
      },
    };
    return this.http
      .get<any>(url, opts)
      .pipe(catchError((error) => throwError(error)));
  }

  GetTemplate(): Observable<Blob> {
    const serviceName = encodeURIComponent(this.service.name);
    const url = `${
      this.URI_API
    }/debt/template?service=${serviceName}&_=${new Date().getTime()}`;
    const headers = new HttpHeaders({
      Authorization: 'bearer ' + this.storage.getCurrentToken(),
      'Ocp-Apim-Subscription-Key': environment.OCP_KEY,
      'Ocp-Apim-Trace': 'true',
    });
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }

  GetLastProcess(): Observable<any> {
    const url = `${this.URI_API}/debt/process/last?_=${new Date().getTime()}`;
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
