import { DataServiceGTP } from './../../shared/models/data-service-gtp';
 import { Component, OnInit, HostListener } from '@angular/core';
 import { GtpService } from 'src/app/shared/services/gtp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
 import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import Swal from 'sweetalert2';
import { drawPopup } from 'src/app/shared/services/popups'; 
import { GtpEmpresa, GtpServcegtp, GtpPost } from 'src/app/shared/models/gtp-post';

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
   public Empgtp: DataEnterpriseGTP = null;
  public Enterprise : DataEnterpriseGTP; 
  public emp :GtpEmpresa
  public scv:GtpServcegtp [] = [];
  public gtppost:GtpPost ;
  public Service : DataServiceGTP;
  public Servgtp : DataServiceGTP; 

  constructor(public gtpService:GtpService, private rutaActiva: ActivatedRoute,public router: Router) { }
  public OcultarDatosActualEmpresa: boolean = true
  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (  this.Formulario ) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  } 
  public indiceActual: number = -1;

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
    
   this.Service = {
    nombre: 'Mensualidad', 
    codDeudor: 'DNI',
    tipoDato: 'C',
    tipoPago: 'C',
    idCuenta: 2,
    nroCuenta: '*********7653 (dolares)',
    moneda: '001',
    simboloMoneda: 'S/',
    usaWebApp: true,
    usaAgente: false,
    usaTienda: true,
    cobraMora: 'S',
    periodoMora: '2',
    tipoMora: 'M',
    monto:12.2,
    pagoPartes: 'S',
    Status:'nuevo Servicio',
    NewNameCod: null,
    NewName: null
   } 
   
  }

 

  onGrabar(emp: DataEnterpriseGTP) {
    this.Enterprise = emp;
    this.Formulario = false;
    
  }

  onGrabarSer(etp:DataServiceGTP){
    this.Service = etp;
    this.ServiciosFormulario = false;
    console.log(this.Service);
    this.gtpService.Service[this.indiceActual] = etp
    this.indiceActual = -1;
    console.log(etp);
  }

  VerCamposEnterprise(etp:DataEnterpriseGTP){
    if(this.ServiciosFormulario == true){
      this.mensaje('Aprobando Servicio ',
      'Actualmente se esta aprobando un Servicio' );
      return;
    }
    this.Formulario = true;
    this.Empgtp = etp; 
  }


  VerCamposSer(etp:DataServiceGTP, index: number){
    if(this.Formulario == true){
      this.mensaje('Aprobando Empresa',
      'Actualmente se esta aprobando una Empresa' );
      return;
    }
    this.ServiciosFormulario = true;
    this.Servgtp = etp;
    this.indiceActual = index;
  
  }

  EnviarAprobados(){
    this.gtppost = null;
    this.scv =[] ;
    this.emp = null;
    let svcSinCta = this.gtpService.Service.filter((v) => v.NewName === null).length;
    let sercant=0;
    let cant = (svcSinCta * 2); 
    console.log('APROBADO?' +this.Enterprise.NombreApproved);
    
    if(this.Enterprise.NombreApproved === null ){
      sercant =  1; 
    }
      this.emp = {ClientId: this.llave, NombreAprobado:this.Enterprise.NombreApproved}; 

      this.gtpService.Service.forEach(s =>{
        this.scv.push({
          ServiceId: s.id,
          NewName: s.NewName,
          NewNameCod: s.NewNameCod
        }); 
      });

      this.gtppost = {
        empresa:  this.emp,
        servicio: this.scv,
      }
      console.log('post');
      console.log(this.gtppost);

    let total = cant + sercant;
    if(total == 0){
      Swal.fire({
        title: 'Aprobacion',
        html: 'Todos los campos han sido revisados <br> ¿Desea terminar? <br> (Se enviara un correo a la empresa)',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, Terminar',
        cancelButtonText:'No, Cancelar',
        onOpen: drawPopup
  
      }).then((result) => { 
        if (result.value) { 
          this.router.navigate(['/gtp']);
        }
      });
    }
    else{
      Swal.fire({
        title: 'Aprobacion',
        html: 'Existen '+total+' campos que no fueron aprobados. <br> ¿Desea terminar?',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, Terminar',
        cancelButtonText:'No, Cancelar',
        onOpen: drawPopup
  
      }).then((result) => { 
        if (result.value) { 
          this.router.navigate(['/gtp']);
        }
      });
    } 
  }

 /*
  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave)
      .subscribe( dataEnterprise => {
        console.table(dataEnterprise); 
        this.Enterprise = dataEnterprise
        console.table(this.Enterprise);
        });

  }
 

*/

OcultarFormulario(requireConfirm: boolean) {
  if (requireConfirm) {
    Swal.fire({
      title: 'Descartar Cambios',
      text: 'Se van a descartar los cambios.',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'DESCARTAR',
      cancelButtonText: 'REGRESAR',
      onOpen: drawPopup
    }).then(r => {
      if (r.value) {
        console.log('descartar');
      
        this.Formulario = false ;  
        console.log(this.Formulario);
      }
    });
  } 
}

OcultarFormularioSer(requireConfirm: boolean) {
  if (requireConfirm) {
    Swal.fire({
      title: 'Descartar Cambios',
      text: 'Se van a descartar los cambios.',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'DESCARTAR',
      cancelButtonText: 'REGRESAR',
      onOpen: drawPopup
    }).then(r => {
      if (r.value) {
        console.log('descartar');
      
        this.ServiciosFormulario = false ; 
        this.indiceActual = -1;
        console.log(this.ServiciosFormulario);
      }
    });
  } 
}

 

  mensaje( titulo: string, text: string) {
    Swal.fire({
     // type: tipo ,
      title: titulo ,
      text: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      // cancelButtonText:  'CERRAR',
      allowOutsideClick: false,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }

 
  
}
