 
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';
import { EnterprisesGtp } from '../models/enterprises-gtp';
import { PendingResquest } from '../models/pending-resquest';
 

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

  /*public Pruebas(){
    this.Empresas.push (
      { ClientId:1, RequestDate: new Date(Date.now()),Ruc:'20000000018', Cu:'20',
       NameEnterprises:'Demo Empresa',Status:'pendiente',requestType:[{type:0,texto:'Nueva Empresa 2 servicios',}] },
       {ClientId:2, RequestDate: new Date(Date.now()),Ruc:'20000000019', Cu:'20',
       NameEnterprises:'Demo Empresa2',Status:'resuelto',requestType:[{type:1,texto:'EMP'},{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       {ClientId:3, RequestDate: new Date(Date.now()),Ruc:'20000000020', Cu:'20',
       NameEnterprises:'Demo Empresa3',Status:'resuelto',requestType:[{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       {ClientId:4, RequestDate: new Date(Date.now()),Ruc:'20000000017', Cu:'20',
       NameEnterprises:'Demo Empresa4',Status:'pendiente',requestType:[{type:1,texto:'EMP'},{type:2,texto:'2 SERV'}] }
    
    );
  } */
  public Empresas: EnterprisesGtp[] = [
    { ClientId:1, RequestDate: new Date(Date.now()),Ruc:'20000000018', Cu:'20',BusinessHeading: 'Colegio',
       NameEnterprises:'Demo Empresa0',Status:'pendiente',requestType:[{type:0,texto:'Nueva Empresa 2 servicios',}] },
       {ClientId:2, RequestDate: new Date(Date.now()),Ruc:'20000000019', Cu:'20',BusinessHeading: 'Transporte',
       NameEnterprises:'Demo Empresa2',Status:'resuelto',requestType:[{type:1,texto:'EMP'},{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       {ClientId:3, RequestDate: new Date(Date.now()),Ruc:'20000000020', Cu:'20',BusinessHeading: 'Venta',
       NameEnterprises:'Demo Empresa3',Status:'resuelto',requestType:[{type:1,texto:'2 SERV'},{type:2,texto:'3 SERV'}] },
       {ClientId:4, RequestDate: new Date(Date.now()),Ruc:'20000000017', Cu:'20',BusinessHeading: 'Colegio',
       NameEnterprises:'Demo Empresa4',Status:'pendiente',requestType:[{type:1,texto:'EMP'},{type:2,texto:'2 SERV'}] }
  ];
 

   private PendingResqs: PendingResquest[] = [
     {type:0,texto:'DatosEmpresa', state:'por revisar', checkFields:[{NombreCampo:'Nombre de la Empresa', Campo:'Colegio de Ing de Peru', aprobado:false}]},
     {type:1,texto:'Servicio Demo1', state:'por revisar', checkFields:[{NombreCampo:'Nombre del Servicio1', Campo:'Mensualidad', aprobado:false}, {NombreCampo:'Codigo Deudor', Campo:'Cod Alumno', aprobado:false}]},
     {type:1,texto:'Servicio Demo2', state:'por revisar',checkFields:[{NombreCampo:'Nombre del Servicio2', Campo:'Mensualidad', aprobado:false}]},
     
   ]

  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 


  getEnterprisesGtp():Observable<EnterprisesGtp[]>{
    console.table(this.Empresas);
    return of(this.Empresas)
  }  

  getPendingResquest():Observable<PendingResquest[]>{
    return of(this.PendingResqs);
  }

}
