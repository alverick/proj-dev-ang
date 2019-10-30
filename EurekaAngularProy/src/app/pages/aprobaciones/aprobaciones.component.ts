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
  public llave: number;
  public Empresa: EnterprisesGtp ;
   public Empgtp: DataEnterpriseGTP = null;
  public Enterprise: DataEnterpriseGTP;
  public emp: GtpEmpresa;
  public scv: GtpServcegtp [] = [];
  public gtppost: GtpPost ;
  public Service: DataServiceGTP;
  public Servgtp: DataServiceGTP;
 public deshabilitar: boolean;
 public indiceActual: number = -1;

  constructor(public gtpService: GtpService, private rutaActiva: ActivatedRoute, public router: Router) { }
  public OcultarDatosActualEmpresa: boolean = true;
  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (  this.Formulario && this.ServiciosFormulario ) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }


  ngOnInit() {
    this.llave =  this.rutaActiva.snapshot.params.llave;
    // borra el back del navegador
    window['_url_loop_'] = 'AprobacionGtp/' + this.llave;
    history.pushState(null, null, 'AprobacionGtp/' + this.llave);
    // mantiene la pagina con el scroll en la parte superior
    window.scrollTo(0, 0);


   this.gtpService.GetServicesGtp(this.llave);
   this.getInfoEmpresa();
/*
   const num =  this.gtpService.services.filter((v) => v.acceptednewName === null && v.inReview === true ).length;
   console.log('cantidad encontrada');
   console.log(num);
   if (num === 0) {

   } else {
    this.deshabilitar = true;
   }
*/
   console.table(this.gtpService.services);
  }


  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave)
      .subscribe( dataEnterprise => {
        this.Enterprise = dataEnterprise;
        });
  }


  onGrabar(emp: DataEnterpriseGTP) {
    this.Enterprise = emp;
    this.Formulario = false;

  }

  onGrabarSer(etp: DataServiceGTP) {
    this.Service = etp;
    this.ServiciosFormulario = false;
    this.gtpService.Service[this.indiceActual] = etp;
    this.indiceActual = -1;
  }

  VerCamposEnterprise(etp: DataEnterpriseGTP) {
    if (this.ServiciosFormulario === true) {
      this.mensaje('Aprobando Servicio ',
      'Actualmente se esta aprobando un Servicio' );
      return;
    }
    this.Formulario = true;
    this.Empgtp = etp;
  }


  VerCamposSer(etp: DataServiceGTP, index: number) {
    if (this.Formulario === true) {
      this.mensaje('Aprobando Empresa',
      'Actualmente se esta aprobando una Empresa' );
      return;
    }
    this.ServiciosFormulario = true;
    this.Servgtp = etp;
    this.indiceActual = index;

  }

  EnviarAprobados() {
    this.gtppost = null;
    this.scv = [] ;
    this.emp = null;
    const svcSinCta = this.gtpService.services.filter((v) => v.acceptednewName === null && v.inReview === true ).length;
    const nombreApp = this.gtpService.services.filter((v) => v.acceptednewName === false && v.inReview === true ).length;
    const CodDeuApp = this.gtpService.services.filter((v) => v.acceptednewNameCode === false && v.inReview === true ).length;
    let notAprov = CodDeuApp + nombreApp;
    let sercant = 0;
    let cant = (svcSinCta * 2);

    if (this.Enterprise.NombreApproved === null ) {
      sercant =  1;
    }
    if (this.Enterprise.NombreApproved === false ) {
      notAprov + 1;
    }

      this.emp = {ClientId: this.llave, NombreAprobado: this.Enterprise.NombreApproved};

      this.gtpService.services.forEach(s => {
        this.scv.push({
          ServiceId: s.id,
          NombreAprobado: s.acceptednewName,
          NombreCodAprobado: s.acceptednewNameCode
        });
      });

      this.gtppost = {
        EnterproseObj:  this.emp,
        ListServiceObj: this.scv,
      };
      console.log('gtp post');
      console.log( this.gtppost);

    let total = cant + sercant;

    if (total === 0) {
        if (notAprov > 0) {
          Swal.fire({
            title: 'Aprobacion',
            html: 'Existen ' + notAprov + ' campos que no fueron aprobados. <br> ¿Desea terminar?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, Terminar',
            cancelButtonText: 'No, Cancelar',
            onOpen: drawPopup
          }).then((result) => {
            if (result.value) {
                this.gtpService.Registrar({ rqst: this.gtppost})
                .subscribe(d => {
                  if (d === true) {
                    this.router.navigate(['/gtp']);
                  } else {

                  }
                });
            }
          });

        } else {
        Swal.fire({
          title: 'Aprobacion',
          html: 'Todos los campos han sido revisados <br> ¿Desea terminar? <br> (Se enviara un correo a la empresa)',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, Terminar',
          cancelButtonText: 'No, Cancelar',
          onOpen: drawPopup

        }).then((result) => {
          if (result.value) {
              this.gtpService.Registrar({ rqst: this.gtppost})
              .subscribe(d => {
                if (d === true) {
                  console.log('sisisisisis');
                  this.router.navigate(['/gtp']);
                } else {
                  console.log('nononon');

                }
              });
          }
        });
      }

    } else {
      this.mensaje( 'Aprobacion', 'Aun faltan aprobar ' + total + ' observaciones' );
    }
  }


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
        this.Formulario = false ;
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
        this.indiceActual = -1;
        this.ServiciosFormulario = false ;

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
