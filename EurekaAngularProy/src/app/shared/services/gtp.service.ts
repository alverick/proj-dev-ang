 
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';
import { EnterprisesGtp } from '../models/enterprises-gtp';

@Injectable({
  providedIn: 'root'
})
export class GtpService {

  constructor(private http: HttpClient) { }

  private States:StatesGtp [] =[
    {idState: 'Pendiente', descripcion:'pendiente'},
    {idState: 'Resuelto ', descripcion:'resuelto '},
    {idState: 'Devuelto', descripcion:'devuelto'},
  ];

  private Empresas: EnterprisesGtp[]= [
    // {IdEnterprise:1, RequestDate:'2019-02-05 00:00:00',Ruc:'20000000018', Cu:'20', NameEnterprises:'Demo Empresa',}
  ]



  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 

}
