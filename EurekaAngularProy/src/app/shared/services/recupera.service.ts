import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecuperaService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }



  public   RecoverPassword(data:any): Observable<any>{
    this.spinner.show(); 
     return this.http.post<any>(`${environment.END_POINT}/Login/Verifying?_=`+ new Date().getTime(), data)
     .pipe(map(r =>{
            
          this.spinner.hide();
          return r;
     }))
     .pipe(catchError(err => {
      this.spinner.hide();
      return throwError(err);
     })); 
  }

}
