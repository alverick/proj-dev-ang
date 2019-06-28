import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginObject } from "src/app/shared/services/login-object.model";
import { Session } from "src/app/shared/models/session.model";


@Injectable()
export class LoginService {

  constructor(private http: HttpClient)  { }
 

  private basePath = '/api/authenticate/';
  
    login(loginObj: LoginObject): Observable<Session> {
      return this.http.post<Session>(this.basePath + 'login', loginObj);
    }
  
    logout(): Observable<Boolean> {
      return this.http.post<Boolean>(this.basePath + 'logout', {});
    }

 
  

}
