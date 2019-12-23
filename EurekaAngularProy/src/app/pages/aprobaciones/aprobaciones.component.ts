import { DataServiceGTP } from './../../shared/models/data-service-gtp';
 import { Component, OnInit, HostListener } from '@angular/core';
 import { GtpService } from 'src/app/shared/services/gtp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import Swal from 'sweetalert2';
import { drawPopup } from 'src/app/shared/services/popups';
import { GtpEmpresa, GtpServcegtp, GtpPost } from 'src/app/shared/models/gtp-post';
import { RubroModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styleUrls: ['./aprobaciones.component.scss']
})
export class AprobacionesComponent implements OnInit {

  public Formulario: boolean = false;
  public ServiciosFormulario: boolean = false;
  public llave: number;
  // public Empresa: EnterprisesGtp ;
  public Empgtp: DataEnterpriseGTP = null;
  public Enterprise: DataEnterpriseGTP = {ruc: 0 , name: '', entry: '', entryName: '', email: '',
  movilNumber: 0 , newName: '', newNameGTPStatus: 0, status: '', uniqueCodeIBK: ''};
  public emp: GtpEmpresa;
  public scv: GtpServcegtp [] = [];
  public gtppost: GtpPost ;
  public Service: DataServiceGTP;
  public Servgtp: DataServiceGTP;
  public deshabilitar: boolean;
  public indiceActual: number = -1;
  public isOnlyEmpresa: boolean;
  public isOnlyService: boolean;
  public rubro: string;
  public serFormAprob: boolean;
  public empresa: any;

  rubros: RubroModel[] = [];

  constructor(public gtpService: GtpService, private rutaActiva: ActivatedRoute,
    public afiliacionService: AfiliacionService,public router: Router) { }
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

   /// TRAE LOS SERVICIOS
   this.gtpService.GetServicesGtp(this.llave);
   this.getInfoEmpresa();
   this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);

  }

  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave)
      .subscribe( dataEnterprise => {
        this.Enterprise = dataEnterprise;
        console.log('Empresa 1');
        console.log(dataEnterprise);
         console.log(this.Enterprise);
        this.rubro =  this.rubros.find((v) => v.code = this.Enterprise.entry).name;
        });
      /*  this.gtpService.GetEnterpriseGtp2(this.llave)
        .subscribe( data => {
          this.empresa = data;
          console.log('EMPRESA 2');
          console.log(this.empresa);
          console.log('END EMPRESA 2');
           }); */
  }

  onGrabar(emp: DataEnterpriseGTP) {
    this.Enterprise = emp;
    this.Formulario = false;
  }

  onGrabarSer(etp: DataServiceGTP) {
    console.log('SERVCICIO GRAVADO');
    console.log(etp);
    console.log('servcicio' + this.indiceActual);

    if (this.indiceActual >= 0) {
      this.Service = etp;
      this.ServiciosFormulario = false;
      this.gtpService.Service[this.indiceActual] = etp;
      this.indiceActual = -1;
    }
  }

/*
  getNameSvc(svc: DataServiceGTP) {
    if (svc.name  !== '?') {
      return svc.name;
   }
    if (svc.name  === '?') {
      return svc.newName.substring(3, svc.newName.length).toString();
   }
  } */
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
    console.log('USA WEB' + etp.useAppWeb);
  }

  MostrarEmpresa() {
    if (this.Enterprise.inReview === false) {
      return false;
    }
    if (this.Enterprise.name !== this.Enterprise.newName ) {
        return true;
    }
    if (this.Enterprise.name === this.Enterprise.newName  || this.Enterprise.inReview === true) {
      return true;
    }
  }

  MostrarEmpresa2() {
   /* console.log('estado de empresa');
    console.log(this.Enterprise.newNameGTPStatus); */
    if (this.Enterprise.newNameGTPStatus === 1) {
      return false;
    } else {
      return true;
    }
  }

  EnviarAprobados() {
    // limpiar el array
    this.scv = [] ;
    // NO APROBADOS
    const nombreApp = this.gtpService.services.filter((svc) => svc.acceptednewName === false && (svc.name !== svc.newName)).length;
    const CodDeuApp = this.gtpService.services.filter((svc) => svc.acceptednewNameCode === false && (svc.debtorCode !== svc.newNameCode)).length;

    // tslint:disable-next-line: max-line-length cunatos son los que faltan revisar
    const ListCantidadNombre = this.gtpService.services.filter((svc) =>  ((svc.newNameGTPStatus === 0 || svc.newNameGTPStatus === 2  ) && (svc.acceptednewName === null)) /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */ ).length;
    // tslint:disable-next-line:max-line-length
    const ListCantidadCodigoDeudor = this.gtpService.services.filter((svc) =>  ( (svc.newNameCodeGTPStatus === 0 || svc.newNameCodeGTPStatus === 2  )  && (svc.acceptednewNameCode === null)) /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */ ).length;

    let Empcant = 0;
    // duplica por que calcula por los 2 la cantidad que falta

    if (this.Enterprise.name !== this.Enterprise.newName) {
      if (this.Enterprise.NombreApproved === null  || this.Enterprise.NombreApproved === undefined ) {
        Empcant =  1;
      }
    }
    // tslint:disable-next-line: max-line-length
    // const ListInAprobacion = this.gtpService.services.filter((svc) => (svc.name !== svc.newName) || (svc.debtorCode !== svc.newNameCode));
    // tslint:disable-next-line:max-line-length
    const ListInAprobacion = this.gtpService.services.filter((svc) => (svc.newNameGTPStatus === 2) || (svc.newNameCodeGTPStatus === 2) || (svc.newNameCodeGTPStatus === 0) /*|| ( (svc.newNameGTPStatus === 3   && svc.name !== ''  && svc.newName !== ''  ))*/);
    const total = ListCantidadNombre + ListCantidadCodigoDeudor + Empcant;

    let desap = 0;
    if (this.Enterprise.NombreApproved === false ) {
      desap = 1;
    }
    const notAprov = CodDeuApp + nombreApp + desap;
    /* console.log('Cantidad que falta aprobar de nombres ' + ListCantidadNombre);
    console.log('Cantidad que falta aprobar de codigo ' + ListCantidadCodigoDeudor);
    console.log('cantidad de no aprobados' + notAprov);
    console.log('EMPRESA'+ this.Enterprise.NombreApproved +' ' + Empcant ); */
    this.emp = {ClientId: this.llave, NombreAprobado: this.Enterprise.NombreApproved};

    ListInAprobacion.forEach(s => {
      this.scv.push({
        ServiceId: s.id,
        NombreAprobado:  (s.name  === s.newName)? true : s.acceptednewName,
        NombreCodAprobado: (s.debtorCode  === s.newNameCode)? true : s.acceptednewNameCode
      });
    });


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

            if ((this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview === false) && this.scv.length === 0) {
              console.log('NO ENVIA NADA');
              this.router.navigate(['/gtp']);
              return;
            }
            if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview  && this.scv.length > 0) {
              console.log('ENVIA AMBOS');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj:  this.emp , ListServiceObj: this.scv })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }

              });
              return;
            }

            if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview === false) {
              console.log('SOLO ENVIA serv');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: null , ListServiceObj: this.scv })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }

              });
              return;
            }
            if (  this.scv.length === 0  ) {
              console.log('SOLO ENVIA EMPRESA');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: this.emp, ListServiceObj: null })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            } else {
              console.log('ENVIA AMBOS');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: this.emp, ListServiceObj: this.scv })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            }

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

            console.log('TODOS LOS CAMPOS AN SIDO APROBADO.......');
            if ( (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview === false)  && this.scv.length === 0) {
              console.log('NO ENVIA NADA ' + this.scv.length);
              this.router.navigate(['/gtp']);
              return;
            }
            if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview  && this.scv.length > 0) {
              console.log('ENVIA AMBOS');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj:  this.emp , ListServiceObj: this.scv })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            }
            if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview === false) {

              console.log('SOLO ENVIA SERVICIOS');

              console.log('IMPRESION FINAL MACHILO');
              console.log(this.scv);
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: null , ListServiceObj: this.scv })
              .subscribe(d => {
                console.log(d);
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            }
            if (  this.scv.length === 0 ) {
              console.log('SOLO ENVIA EMPRESA');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: this.emp, ListServiceObj: null })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            } else {
              console.log('ENVIA AMBOS');
              this.gtpService.AprobarEmpresaServ({ EnterpriseObj: this.emp, ListServiceObj: this.scv })
              .subscribe(d => {
                if (d) {
                  this.router.navigate(['/gtp']);
                } else {

                }
              });
              return;
            }
          }
          this.gtppost = {
            EnterpriseObj:  this.emp,
            ListServiceObj: this.scv
          };
          console.log('IMPRESION FINAL');
          console.log(this.gtppost);
        });

      }
    } else {
      this.mensaje( 'Aprobacion', 'Aun faltan aprobar ' +
      total + ' observaciones' );
    }
  }

  /*
      newName         name
    minimarket         ''       NUEVO     0  -
      ''            minimarket  APROBADO  1
      sm            minimarket  EDITADO   2  -
      sm            minimarket  RECHAZADO 3
      ''               sm       APROBADO  1
  */


  getNames(svc: DataServiceGTP) {
    if (svc.name  === '?' && svc.newName !== '?' ) {
      if (svc.newName.substring(0, 3).toString() === '???' ) {
        return svc.newName.substring(3, svc.newName.length).toString();
      }
      return svc.newName;
    }
    if ( svc.name  !== '?' && svc.newName !== '?') {
      return svc.name;
    }
  }
/*
  getName2(svc: DataServiceGTP) {
    if (svc.newNameGtpStatus === 0 && svc.newNameCodeGtpStatus === 0) {
      return svc.newName;
    }
    if (svc.newNameGtpStatus > 0 && svc.newNameCodeGtpStatus > 0) {
      return svc.name;
    }
  } */
  getName(svc: DataServiceGTP) {
    if ((svc.newNameGTPStatus === 0 && svc.newNameCodeGTPStatus === 0) || (svc.newNameGTPStatus === 3 && svc.newNameCodeGTPStatus === 3)) {
      return svc.newName;
    }
    if ((svc.newNameGTPStatus === 1 && svc.newNameCodeGTPStatus === 1 ) || (svc.newNameGTPStatus === 2 && svc.newNameCodeGTPStatus === 2 )) {
      return svc.name;
    }
  }

  getStateEnterprise (Enterprise: DataEnterpriseGTP ) {
    //  console.log('estado de la empresa' + data.newNameGTPStatus);
      if (Enterprise.newNameGTPStatus = 0) {
        return 'Nueva Empresa';
      }
      if (Enterprise.newNameGTPStatus = 1) {
        return 'Empresa Aprobada';
      }
      if (Enterprise.newNameGTPStatus = 2) {
        return 'Empresa Editada';
      }
      if (Enterprise.newNameGTPStatus = 3) {
        return 'Empresa Rechazada';
      }
  }

  /* getStatess(svc: DataServiceGTP) {
     if (((svc.name === '?' || svc.debtorCode === '?') &&  svc.inReview) && ((svc.newName.substring(0, 3).toString() !== '???' && svc.newNameCode.substring(0, 3).toString() !== '???') )) {
      this.serFormAprob = true;
      return 'Nuevo servicio';
    }
    if ((svc.newName.substring(0, 3).toString() !== '???' || svc.newNameCode.substring(0, 3).toString() !== '???') && ( (svc.name === svc.newName) && (svc.debtorCode === svc.newNameCode)) ) {
      this.serFormAprob = false;
      return 'Servicio habilitado';
    }
    if (svc.newName.substring(0, 3).toString() === '???' || svc.newNameCode.substring(0, 3).toString() === '???') {
      this.serFormAprob = false;
      return 'Servicio rechazado';
    }
    if (((svc.name !==  '?' )&&(svc.name !== svc.newName)) || ( (svc.debtorCode !==  '?' ) && (svc.debtorCode !== svc.newNameCode))  ) {
      this.serFormAprob = false;
      return 'Servicio editado';
    }
  }*/

  getState(svc: DataServiceGTP ) {
   // console.log('servicios' + svc.newNameGtpStatus + ' ' +  svc.newNameCodeGtpStatus);

    if (svc.newNameGTPStatus === 0 && svc.newNameCodeGTPStatus === 0) {
      return 'Nueva servicio';
    }
    if  (svc.newNameGTPStatus === 1 && svc.newNameCodeGTPStatus === 1) {
      return 'Servicio aprobado';
    }
    if (svc.newNameGTPStatus === 2 || svc.newNameCodeGTPStatus === 2) {
      return 'Servicio editado';
    }
    if (svc.newNameGTPStatus === 3 || svc.newNameCodeGTPStatus === 3) {
      return 'Servicio rechazado';
    }

   // console.log('MARCELO');
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
