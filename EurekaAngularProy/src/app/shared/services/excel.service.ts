import { Error } from './../models/error.model';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import { Observable, throwError } from "rxjs";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { catchError } from "rxjs/operators";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const SERVICIO = 'Servicio';

@Injectable()
export class ExcelService {
  private URI_API: string = environment.END_POINT;
  public statusUpload: boolean = false;

  constructor(public http: HttpClient, private storage: StorageService, ) { }

  /* ///////////////////////////////////
  ////////// U P L O A D /////////////////
  //////////////////////////////////////////  */ 

  public service: any = '';
  public idProcess: number = 0;
  public errores: Error[] = [];

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
}
