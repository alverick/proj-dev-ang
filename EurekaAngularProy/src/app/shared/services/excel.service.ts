import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Error } from './../models/error.model';
import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";
import { environment } from "src/environments/environment";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const SERVICIO = 'Servicio';

@Injectable()
export class ExcelService {
  private URI_API: string = environment.END_POINT;
  public statusUpload: boolean = false;

  constructor(public http: HttpClient, private storage: StorageService, ) { }

  /* ///////////////////////////////////
  ////////// D O W N L O A D /////////////////
  //////////////////////////////////////////  */

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  /* ///////////////////////////////////
  ////////// U P L O A D /////////////////
  //////////////////////////////////////////  */

  public service: any = '';
  public idProcess: number = 0;
  public fileName: string = '';
  public errores: Error[] = [];
  // public cuadro_errores: boolean;
  // public messageUploadExcel: boolean = true;


  UploadExcel(files: any, service: string, changestatus: boolean): Observable<any> {
    this.statusUpload = changestatus;
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${service}?_=` + new Date().getTime();
    const opts={
      headers: {
        "Authorization" : "bearer " + this.storage.getCurrentToken(),
        "Ocp-Apim-Subscription-Key": environment.END_POINT,
        "Ocp-Apim-Trace": "true"
      }
    }
    const formData = new FormData();
    formData.append('file', files[0], files[0].name)
    return this.http.post<any>(url, formData, opts).pipe(
      catchError(error => throwError(error)));
  }

  StatusExcel(id: number): Observable<any> {
    const url = `${this.URI_API}/debt/process/${id}/status?_=` + new Date().getTime();
    const opts = {
      headers: {"Authorization" : "bearer " + this.storage.getCurrentToken(),
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": "true"}
    }
    return this.http.get<any>(url, opts).pipe(catchError(error => throwError(error)));

  }

  GetTemplate(): Observable<Blob> {
    var serviceName = encodeURIComponent(this.service.name);
    const url = `${this.URI_API}/debt/template?service=${serviceName}&_=${new Date().getTime()}`;
    const headers = new HttpHeaders({
      "Authorization": "bearer " + this.storage.getCurrentToken(),
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": 'true'
    });
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }

  GetLastProcess(): Observable<any> {
    const url = `${this.URI_API}/debt/process/last?_=${new Date().getTime()}`;
    return this.http.get<any>(url)
      .pipe(map(v => {
        if (v.status !== 'COMPLETED' && v.status !== 'REJECTED') {
          this.statusUpload = true;
          this.idProcess = v.id;
        }
        return v;
      }));
  }
}
