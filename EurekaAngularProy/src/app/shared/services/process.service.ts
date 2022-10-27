import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private http: HttpClient, private storage: StorageService, private spinner: NgxSpinnerService) { }

  getList(clientId, page: number): Observable<any> {
    const limit = 50;
    const start = (page - 1) * limit;
    const url = `${environment.END_POINT}/Company/GTP/client/${clientId}/process?start=${start}&limit=${limit}`;
    const opts = {
      headers: { Authorization: 'bearer ' + this.storage.getCurrentToken() },
    };
    return this.http
      .get<any>(url, opts)
      .pipe(catchError((error) => throwError(error)));
  }

  getFile(processId: number): Observable<any> {
    const url = `${environment.END_POINT}/Company/GTP/process/${processId}/file`;
    return this.http
      .get(url, {
        headers: { Authorization: 'bearer ' + this.storage.getCurrentToken() },
        responseType: 'blob',
      })
      .pipe(catchError((error) => throwError(error)));
  }
}
