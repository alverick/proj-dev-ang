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
  public Enterprise: DataEnterpriseGTP = {ruc: 0 , name: '', entry: '', email: '',
  movilNumber: 0 , newName: '' , status: '', uniqueCodeIBK: ''};
  public emp: GtpEmpresa;
  public scv: GtpServcegtp [] = [];
  public gtppost: GtpPost ;
  public Service: DataServiceGTP;
  public Servgtp: DataServiceGTP;
  public deshabilitar: boolean;
  public indiceActual: number = -1;
  public isOnlyEmpresa: boolean;
  public isOnlyService: boolean;
  public rubro:string;
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
   this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }


  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave)
      .subscribe( dataEnterprise => {
        this.Enterprise = dataEnterprise;
        console.log(this.Enterprise);
        this.rubro =  this.rubros.find((v) => v.code = this.Enterprise.entry).name;
        });
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


  getNameSvc(svc: DataServiceGTP) {
    if (svc.name  !== '?') {
      return svc.name;
   }
    if (svc.name  === '?') {
      return svc.newName.substring(3, svc.newName.length).toString();
   }
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
    console.log('USA WEB'+ etp.useAppWeb);
  }

  EnviarAprobados(){
    // limpiar el array
    this.scv = [] ;
    // NO APROBADOS
    const nombreApp = this.gtpService.services.filter((svc) => svc.acceptednewName === false && (svc.name !== svc.newName)).length;
    const CodDeuApp = this.gtpService.services.filter((svc) => svc.acceptednewNameCode === false && (svc.debtorCode !== svc.newNameCode)).length;

    // tslint:disable-next-line: max-line-length cunatos son los que faltan revisar
    const ListCantidadNombre = this.gtpService.services.filter((svc) =>  ((svc.name !== svc.newName) && (svc.acceptednewName === null)) /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */ ).length;
    const ListCantidadCodigoDeudor = this.gtpService.services.filter((svc) =>  ( (svc.debtorCode !== svc.newNameCode) && (svc.acceptednewNameCode === null)) /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */ ).length;

    // tslint:disable-next-line: max-line-length
    const ListInAprobacion = this.gtpService.services.filter((svc) => (svc.name !== svc.newName) || (svc.debtorCode !== svc.newNameCode));
    let total = ListCantidadNombre + ListCantidadCodigoDeudor;
    let notAprov = CodDeuApp + nombreApp;
    console.log('Cantidad que falta aprobar de nombres ' + ListCantidadNombre);
    console.log('Cantidad que falta aprobar de codigo ' + ListCantidadCodigoDeudor);
    console.log('cantidad de no aprobados' + notAprov);

    this.emp = {ClientId: this.llave, NombreAprobado: this.Enterprise.NombreApproved};
    console.log('SERVICIOS M');
    // console.log(ListInReview);
    ListInAprobacion.forEach(s => {
      this.scv.push({
        ServiceId: s.id,
        NombreAprobado:  (s.name  === s.newName)? true : s.acceptednewName,
        NombreCodAprobado: (s.debtorCode  === s.newNameCode)? true : s.acceptednewNameCode
      });
    });

    console.log(this.scv);
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

              console.log('SOLO ENVIA SERVICIOS');
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
      this.mensaje( 'Aprobacion', 'Aun faltan aprobar ' + total + ' observaciones' );
    }
  }


  thisEnviarAprobados () {
    this.gtppost = null;
    this.scv = [] ;
    this.emp = null;
    // cuantos faltan??
    const svcSinCta = this.gtpService.services.filter((v) => v.acceptednewName === null && v.inReview === true ).length;
    // cuantos nombres fueron deshaprobados
    const nombreApp = this.gtpService.services.filter((v) => v.acceptednewName === false && v.inReview === true ).length;
    // cuantos Codigos deudores fueron deshaprobados
    const CodDeuApp = this.gtpService.services.filter((v) => v.acceptednewNameCode === false && v.inReview === true ).length;
    // filtra los que estan en estado inReview y los quye no estan devueltos
    const ListInReview = this.gtpService.services.filter((svc) =>  (svc.inReview === true) &&
     // tslint:disable-next-line:max-line-length
     (/*(svc.newName.substring(0, 3).toString() !== '???') ||
     (svc.newNameCode.substring(0, 3).toString() !== '???') ||*/
     (svc.name !== svc.newName) || (svc.debtorCode !== svc.newNameCode)));
     // suma codigo deudor y nombre de serivicio deshaprobados
    let notAprov = CodDeuApp + nombreApp;
    let sercant = 0;
    // duplica por que calcula por los 2 la cantidad que falta
    let cant = (svcSinCta * 2);

    if (this.Enterprise.NombreApproved === null ) {
      sercant =  1;
    }
    // suma la empresa  desaprobada
    if (this.Enterprise.NombreApproved === false ) {
      notAprov + 1;
    }

      this.emp = {ClientId: this.llave, NombreAprobado: this.Enterprise.NombreApproved};
      console.log('SERVICIOS M');
      // console.log(ListInReview);
      ListInReview.forEach(s => {
        this.scv.push({
          ServiceId: s.id,
          NombreAprobado: s.acceptednewName,
          NombreCodAprobado: s.acceptednewNameCode
        });
      });

      console.log(this.scv);


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

              if (this.Enterprise.name === this.Enterprise.newName && this.scv.length === 0) {
                console.log('NO ENVIA NADA');
                this.router.navigate(['/gtp']);
                return;
              }
              if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview) {
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

              if (this.Enterprise.name === this.Enterprise.newName) {
                this.gtpService.AprobarEmpresaServ({ EnterpriseObj: null , ListServiceObj: this.scv })
                .subscribe(d => {
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

            if (this.Enterprise.name === this.Enterprise.newName && this.scv.length === 0) {
              console.log('NO ENVIA NADA');
             /* this.gtppost = {
                EnterpriseObj:  null,
                ListServiceObj: this.scv
              };
              console.log(this.gtppost); */
              console.log('IMPRESION FINAL');
              console.log(this.scv);
              this.router.navigate(['/gtp']);
              return;
            }
            if (this.Enterprise.name === this.Enterprise.newName && this.Enterprise.inReview) {
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
            if (this.Enterprise.name === this.Enterprise.newName) {

              console.log('SOLO ENVIA SERVICIOS');
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
      this.mensaje( 'Aprobacion', 'Aun faltan aprobar ' + total + ' observaciones' );
    }
  }

  getName(svc: DataServiceGTP) {
    if (svc.name  === '?' && svc.newName !== '?' ) {
      if (svc.newName.substring(0,3).toString() === '???' ) {
        return svc.newName.substring(3, svc.newName.length).toString();
      }
      return svc.newName;
    }
    if ( svc.name  !== '?' && svc.newName !== '?') {
      return svc.name;
    }
  }
   getState(svc: DataServiceGTP) {
    if (((svc.name === '?'  &&  svc.debtorCode === '?') &&  svc.inReview) || (svc.newName.substring(0, 3).toString() !== '???' || svc.newNameCode.substring(0, 3).toString() !== '???') ) {
      return 'Nuevo Servicio';
    }
    if(svc.newName.substring(0, 3).toString() === '???' || svc.newNameCode.substring(0, 3).toString() === '???') {
      return 'Servicio Rechazado';
    }
    if (((svc.name !==  '?' )&&(svc.name !== svc.newName)) || ( (svc.debtorCode !==  '?' ) && (svc.debtorCode !== svc.newNameCode)) &&  svc.inReview) {
      return 'Edicion de Servicio';
    }

   /* if((svc.newName.substring(0, 3).toString() !== '???' || svc.newNameCode.substring(0, 3).toString() !== '???')){
      return 'Servicio Modificado';
    }
    if( ((svc.name === '?'  &&  svc.debtorCode === '?') &&  svc.inReview)){
      return 'Servicio Modificado';
    }  */
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
