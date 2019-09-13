import { Error } from './../models/error.model';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import { Observable, throwError } from "rxjs";
import { Http, Headers, ResponseContentType } from "@angular/http";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { catchError, map } from "rxjs/operators";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const SERVICIO = 'Servicio';

@Injectable()
export class ExcelService {
  private URI_API: string = environment.END_POINT;
  public statusUpload: boolean = false;

  constructor(public http: HttpClient, private nativeHttp: Http, private storage: StorageService, ) { }

  /* ///////////////////////////////////
  ////////// D O W N L O A D /////////////////
  //////////////////////////////////////////  */

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
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
  public errores: Error[] = [];
  // public messageUploadExcel: boolean = true;


  UploadExcel(files: any, service: string, changestatus: boolean): Observable<any> {
    this.statusUpload = changestatus;
    console.log(files);
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
    console.log(url);
    return this.http.post<any>(url, formData, opts).pipe(
      catchError(error => throwError(error)));
  }

  StatusExcel(id: number): Observable<any>{
    //this.statusUpload = status;
    console.log('begin status excel')
    const url = `${this.URI_API}/debt/process/${id}/status?_=` + new Date().getTime();
    const opts={
      headers: {"Authorization" : "bearer " + this.storage.getCurrentToken(),
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": "true"}
    }
    return this.http.get<any>(url, opts).pipe(catchError(error => throwError(error)));

  }

  GetTemplate(): Observable<any> {
    const url = `${this.URI_API}/debt/template?service=${this.service.name}&_=`+ new Date().getTime();
    const headers = new Headers({
      "Authorization": "bearer " + this.storage.getCurrentToken(),
      "Ocp-Apim-Subscription-Key": environment.OCP_KEY,
      "Ocp-Apim-Trace": 'true'
    });
    console.log(url);
    return this.nativeHttp.get(url, {
      headers: headers,
      responseType: ResponseContentType.Blob
    })
    .pipe(map(r => r.blob()));
  }
}
