import { DataServiceGTP } from './../../shared/models/data-service-gtp';
 import { Component, OnInit, HostListener } from '@angular/core';
import { PendingResquest } from 'src/app/shared/models/pending-resquest';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
 import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styleUrls: ['./aprobaciones.component.scss']
})
export class AprobacionesComponent implements OnInit {

  public Formulario: boolean = false;
  public ServiciosFormulario: boolean = false;
  public llave:number;
  public Empresa:EnterprisesGtp ;
  public pending: PendingResquest[]; 
  public Empgtp: DataEnterpriseGTP = null;
  public Enterprise : DataEnterpriseGTP; 

  public Service : DataServiceGTP;
  public Servgtp : DataServiceGTP; 

  constructor(public gtpService:GtpService, private rutaActiva: ActivatedRoute) { }
  public OcultarDatosActualEmpresa: boolean = true
  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (  this.Formulario ) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  } 
 

  ngOnInit() {
    this.llave =  this.rutaActiva.snapshot.params.llave;
    // borra el back del navegador
    window['_url_loop_'] = 'AprobacionGtp/'+this.llave;
    history.pushState(null, null, 'AprobacionGtp/'+this.llave);
    // mantiene la pagina con el scroll en la parte superior
    window.scrollTo(0, 0); 
 
     
   this.Enterprise  = {
    ruc:12345678912,
    name:'nombre actual',
    entry: '04', 
    email: 'mnievafra@gmail.com',
    movilNumber: 123456 , 
    newName:'Nuevo Nombre', 
    status: 'nueva empresa', 
    uniqueCodeIBK: '1321321', 
    requestDate:new Date(Date.now()),
    NombreApproved: null
   }

   /*
    id?: number; //1
    nombre: string; //1
    rubro?: number; //1
    codDeudor?: string; //1
    nameCod?: string; //1
    tipoDato: string; //1
    tipoPago?: string; //1
    nroCuenta: string; //1
    idCuenta: number; //1
    moneda: string; //1
    simboloMoneda?: string; //1
    usaWebApp: boolean; //1
    usaAgente: boolean; //1
    usaTienda: boolean; //1
    cobraMora: string; //1
    periodoMora: string; //1
    tipoMora: string; //1
    monto?: number; //1
    porcentaje?: number; //1
    inReview?: boolean;   //1
    pagoPartes?: string; //1
    Status:string;
    NewNameCod:string;
    NewName:string;
    */
    
   this.Service = {
    nombre: 'Mensualidad', 
    codDeudor: 'DNI',
    tipoDato: 'C',
    tipoPago: 'C',
    idCuenta: 0,
    nroCuenta: '',
    moneda: '001',
    simboloMoneda: 'S/',
    usaWebApp: true,
    usaAgente: false,
    usaTienda: false,
    cobraMora: 'N',
    periodoMora: '1',
    tipoMora: 'M',
    pagoPartes: 'N',
    Status:'nuevo Servicio',
    NewNameCod: null,
    NewName: null
   }

  }

 

  onGrabar(emp: DataEnterpriseGTP) {
    this.Enterprise = emp;
    this.Formulario = false;
    console.table(this.Enterprise);
  }

  VerCamposEnterprise(etp:DataEnterpriseGTP){
    this.Formulario = true;
    this.Empgtp = etp; 
  }


  VerCamposSer(etp:DataServiceGTP){
    this.ServiciosFormulario = true;
    this.Servgtp = etp;
    console.table(etp); 
  }

  

 
}
