import { Component, OnInit, HostListener } from '@angular/core';
import { PendingResquest } from 'src/app/shared/models/pending-resquest';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { ActivatedRoute } from '@angular/router';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
import { CheckFields } from 'src/app/shared/models/check-fields';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styleUrls: ['./aprobaciones.component.scss']
})
export class AprobacionesComponent implements OnInit {
  public llave:number;
  public Empresa:EnterprisesGtp ;
  pending: PendingResquest[];
  public Check:CheckFields[];
  public formulario :boolean =true;
  constructor(public gtpService:GtpService, private rutaActiva: ActivatedRoute) { }
  OcultarDatosActualEmpresa: boolean = true
  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (  this.formulario ) {
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

    // prubea
    console.log(this.llave);
    this.getPendingGtp();

  /*  let emp = this.pending.find((v) => v.type === 0).type;
     
     if(emp === 0) {
       this.OcultarDatosActualEmpresa =false;
     }else{
      this.OcultarDatosActualEmpresa =true;
     } */

    
      
    this.Empresa = this.gtpService.Empresas.find((v) => v.Ruc= '20000000020');
   


  }
/*
  getEmpresa(id:any){
      this.Empresa = this.gtpService.Empresas.find((v) => v.ClientId= id);
   // return this.gtpService.getEnterprisesGtp().subscribe(d => this.Empresa = d);
   console.log('Empresa');
      console.log(this.Empresa);
  } */

  getPendingGtp(){
    return this.gtpService.getPendingResquest().subscribe(d => this.pending = d);
  }



  VerCampos(id:number){
    this.Check = this.gtpService.PendingResqs.find((r) => r.idSolicitud = id).checkFields;
    console.table(this.Check);
 
  }

 
}
