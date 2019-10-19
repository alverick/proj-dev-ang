 
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
    {ClientId:1, RequestDate: new Date(Date.now()),Ruc:'20000000018', Cu:'20',
     NameEnterprises:'Demo Empresa',Status:'pendiente',requestType:[{type:0,texto:'Nueva Empresa 2 servicios'}] },
     {ClientId:2, RequestDate: new Date(Date.now()),Ruc:'20000000019', Cu:'20',
     NameEnterprises:'Demo Empresa2',Status:'resuelto',requestType:[{type:1,texto:'EMP'},{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
     {ClientId:3, RequestDate: new Date(Date.now()),Ruc:'20000000020', Cu:'20',
     NameEnterprises:'Demo Empresa3',Status:'resuelto',requestType:[{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
     {ClientId:4, RequestDate: new Date(Date.now()),Ruc:'20000000017', Cu:'20',
     NameEnterprises:'Demo Empresa4',Status:'pendiente',requestType:[{type:1,texto:'EMP'},{type:2,texto:'2 SERV'}] }

     //type:0, texto:'Nueva Empresa 2 servicios'
  ]



  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 


  getEnterprisesGtp():Observable<EnterprisesGtp[]>{
    return of(this.Empresas)
  }

}
