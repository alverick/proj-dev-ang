import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appFullRoutingNames } from 'src/app/app-routing.names';
import { RubroModel } from 'src/app/shared/models';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import {
  GtpEmpresa,
  GtpPost,
  GtpServcegtp,
} from 'src/app/shared/models/gtp-post';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { DataServiceGTP } from '../../../../shared/models/data-service-gtp';
import { adminFullRoutingNames } from '../../admin-routing.names';

// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'cs-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styleUrls: ['./aprobaciones.component.scss'],
})
export class AprobacionesComponent implements OnInit {
  public Formulario: boolean = false;
  public ServiciosFormulario: boolean = false;
  public llave: number;
  // public Empresa: EnterprisesGtp ;
  public Empgtp: DataEnterpriseGTP = null;
  public Enterprise: DataEnterpriseGTP = {
    ruc: 0,
    name: '',
    entry: '',
    entryName: '',
    email: '',
    movilNumber: 0,
    movilOperator: '',
    newName: '',
    newNameGTPStatus: -1,
    status: '',
    uniqueCodeIBK: '',
    useAgencyChannel: false,
  };
  public emp: GtpEmpresa;
  public scv: GtpServcegtp[] = [];
  public gtppost: GtpPost;
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

  constructor(
    public gtpService: GtpService,
    private rutaActiva: ActivatedRoute,
    public afiliacionService: AfiliacionService,
    public router: Router
  ) {}
  public OcultarDatosActualEmpresa: boolean = true;
  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (this.Formulario && this.ServiciosFormulario) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.llave = this.rutaActiva.snapshot.params.llave;
    // borra el back del navegador
    window['_url_loop_'] = adminFullRoutingNames.APPROVE + this.llave;
    history.pushState(null, null, adminFullRoutingNames.APPROVE + this.llave);
    // mantiene la pagina con el scroll en la parte superior
    window.scrollTo(0, 0);

    /// TRAE LOS SERVICIOS
    this.gtpService.GetServicesGtp(this.llave);
    this.afiliacionService.GetRubrosAll().subscribe((d) => {
      this.rubros = d;
      this.getInfoEmpresa();
    });
  }

  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave).subscribe((dataEnterprise) => {
      this.Enterprise = dataEnterprise;
      this.rubro = this.rubros.find(
        (v) => v.code === this.Enterprise.entry
      ).name;
    });
    /*  this.gtpService.GetEnterpriseGtp2(this.llave)
      .subscribe( data => {
        this.empresa = data;

         }); */
  }

  onGrabar(emp: DataEnterpriseGTP) {
    this.Enterprise = emp;
    this.Formulario = false;
  }

  onGrabarSer(etp: DataServiceGTP) {
    if (this.indiceActual >= 0) {
      this.Service = etp;
      this.ServiciosFormulario = false;
      this.gtpService.services[this.indiceActual] = etp;
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
      this.mensaje(
        'Aprobando Servicio ',
        'Actualmente se esta aprobando un Servicio'
      );
      return;
    }
    this.Formulario = true;
    this.Empgtp = etp;
  }

  VerCamposSer(etp: DataServiceGTP, index: number) {
    if (this.Formulario === true) {
      this.mensaje(
        'Aprobando Empresa',
        'Actualmente se esta aprobando una Empresa'
      );
      return;
    }
    this.ServiciosFormulario = true;
    this.Servgtp = etp;
    this.Servgtp.useAgencyChannel = this.Enterprise.useAgencyChannel;
    this.indiceActual = index;
  }

  MostrarEmpresa() {
    if (this.Enterprise.inReview === false) {
      return false;
    }
    if (this.Enterprise.name !== this.Enterprise.newName) {
      return true;
    }
    if (
      this.Enterprise.name === this.Enterprise.newName ||
      this.Enterprise.inReview === true
    ) {
      return true;
    }
  }

  MostrarEmpresa2() {
    if (this.Enterprise.newNameGTPStatus === 1) {
      return false;
    } else {
      return true;
    }
  }

  EnviarAprobados() {
    // debugger
    let entryDiff = false;
    this.gtpService.services.forEach((s) => {
      if (s.res.length > 0 && s.res.substring(0, 2) !== this.Enterprise.entry)
        entryDiff = true;
    });
    if (entryDiff) {
      this.mensaje(
        'Error en Rubro',
        'La res es diferente del rubro, no se puede enviar a PAG'
      );
      return;
    }
    // limpiar el array
    this.scv = [];
    // NO APROBADOS
    const nombreApp = this.gtpService.services.filter(
      (svc) => svc.acceptednewName === false && svc.name !== svc.newName
    ).length;
    const CodDeuApp = this.gtpService.services.filter(
      (svc) =>
        svc.acceptednewNameCode === false && svc.debtorCode !== svc.newNameCode
    ).length;

    // tslint:disable-next-line: max-line-length cunatos son los que faltan revisar
    const ListCantidadNombre = this.gtpService.services.filter(
      (svc) =>
        (svc.newNameGTPStatus === 0 || svc.newNameGTPStatus === 2) &&
        svc.acceptednewName ===
          null /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */
    ).length;
    // tslint:disable-next-line:max-line-length
    const ListCantidadCodigoDeudor = this.gtpService.services.filter(
      (svc) =>
        (svc.newNameCodeGTPStatus === 0 || svc.newNameCodeGTPStatus === 2) &&
        svc.acceptednewNameCode ===
          null /*&& (svc.acceptednewName === null || svc.acceptednewNameCode === null ) */
    ).length;

    let Empcant = 0;
    // duplica por que calcula por los 2 la cantidad que falta

    if (
      this.Enterprise.name.toUpperCase() ===
      this.Enterprise.newName.toUpperCase()
    ) {
      this.Enterprise.NombreApproved = true;
    } else {
      if (
        this.Enterprise.NombreApproved === null ||
        this.Enterprise.NombreApproved === undefined
      ) {
        Empcant = 1;
      }
    }
    // tslint:disable-next-line: max-line-length
    // const ListInAprobacion = this.gtpService.services.filter((svc) => (svc.name !== svc.newName) || (svc.debtorCode !== svc.newNameCode));
    // tslint:disable-next-line:max-line-length
    const ListInAprobacion = this.gtpService.services.filter(
      (svc) =>
        svc.newNameGTPStatus === 2 ||
        svc.newNameGTPStatus === 0 ||
        svc.newNameCodeGTPStatus === 2 ||
        svc.newNameCodeGTPStatus === 0 ||
        svc.res !==
          '' /*|| ( (svc.newNameGTPStatus === 3   && svc.name !== ''  && svc.newName !== ''  ))*/
    );

    const total = ListCantidadNombre + ListCantidadCodigoDeudor + Empcant;

    let desap = 0;
    if (this.Enterprise.NombreApproved === false) {
      desap = 1;
    }
    const notAprov = CodDeuApp + nombreApp + desap;
    this.emp = {
      ClientId: this.llave,
      NombreAprobado: this.Enterprise.NombreApproved,
    };
    // debugger
    ListInAprobacion.forEach((s) => {
      this.scv.push({
        ServiceId: s.id,
        NombreAprobado: s.name === s.newName ? true : s.acceptednewName,
        NombreCodAprobado:
          s.debtorCode === s.newNameCode ? true : s.acceptednewNameCode,
        Res: s.res,
      });
    });

    if (total === 0) {
      if (notAprov > 0) {
        if (this.Enterprise.isNewEnterprise) {
          Swal.fire({
            title: 'Aprobacion',
            html:
              'Existen ' +
              notAprov +
              ' campos que no fueron aprobados. <br> ¿Desea rechazar la Afiliación?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, Rechazar afiliación',
            cancelButtonText: 'No, Solicitar corrección de datos',
            onOpen: drawPopup,
          }).then((result) => {
            // debugger

            if (result.value) {
              this.gtpService
                .AprobarEmpresaServ({
                  Rechaza: true,
                  EnterpriseObj: this.emp,
                  ListServiceObj: this.scv,
                })
                .subscribe((d) => {
                  if (d) {
                    this.router.navigate([appFullRoutingNames.ADMIN]);
                  }
                });
              return;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview === false &&
                this.scv.length === 0
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }
              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview &&
                this.scv.length > 0
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }

              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview === false
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: null,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }
              if (this.scv.length === 0) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: null,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              } else {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
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
            html:
              'Existen ' +
              notAprov +
              ' campos que no fueron aprobados. <br> ¿Desea solicitar corrección de datos?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, Solicitar corrección de datos',
            cancelButtonText: 'No, Cancelar',
            onOpen: drawPopup,
          }).then((result) => {
            if (result.value) {
              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview === false &&
                this.scv.length === 0
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }
              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview &&
                this.scv.length > 0
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }

              if (
                this.Enterprise.name === this.Enterprise.newName &&
                this.Enterprise.inReview === false
              ) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: null,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }
              if (this.scv.length === 0) {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: null,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              } else {
                this.gtpService
                  .AprobarEmpresaServ({
                    Rechaza: false,
                    EnterpriseObj: this.emp,
                    ListServiceObj: this.scv,
                  })
                  .subscribe((d) => {
                    if (d) {
                      this.router.navigate([appFullRoutingNames.ADMIN]);
                    } else {
                    }
                  });
                return;
              }
            }
          });
        }
      } else {
        Swal.fire({
          title: 'Aprobacion',
          html: 'Todos los campos han sido revisados <br> ¿Desea terminar? <br> (Se enviara un correo a la empresa)',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, Terminar',
          cancelButtonText: 'No, Cancelar',
          onOpen: drawPopup,
        }).then((result) => {
          if (result.value) {
            // debugger

            if (
              this.Enterprise.name === this.Enterprise.newName &&
              this.Enterprise.inReview === false &&
              this.scv.length === 0
            ) {
              // this.router.navigate([appFullRoutingNames.ADMIN]);
              return;
            }
            if (
              this.Enterprise.name === this.Enterprise.newName &&
              this.Enterprise.inReview &&
              this.scv.length > 0
            ) {
              this.gtpService
                .AprobarEmpresaServ({
                  EnterpriseObj: this.emp,
                  ListServiceObj: this.scv,
                })
                .subscribe((d) => {
                  if (d) {
                    this.router.navigate([appFullRoutingNames.ADMIN]);
                  } else {
                  }
                });
              return;
            }
            if (
              this.Enterprise.name === this.Enterprise.newName &&
              this.Enterprise.inReview === false
            ) {
              this.gtpService
                .AprobarEmpresaServ({
                  EnterpriseObj: null,
                  ListServiceObj: this.scv,
                })
                .subscribe((d) => {
                  if (d) {
                    this.router.navigate([appFullRoutingNames.ADMIN]);
                  } else {
                  }
                });
              return;
            }
            if (this.scv.length === 0) {
              this.gtpService
                .AprobarEmpresaServ({
                  EnterpriseObj: this.emp,
                  ListServiceObj: null,
                })
                .subscribe((d) => {
                  if (d) {
                    this.router.navigate([appFullRoutingNames.ADMIN]);
                  } else {
                  }
                });
              return;
            } else {
              this.gtpService
                .AprobarEmpresaServ({
                  EnterpriseObj: this.emp,
                  ListServiceObj: this.scv,
                })
                .subscribe((d) => {
                  if (d) {
                    this.router.navigate([appFullRoutingNames.ADMIN]);
                  } else {
                  }
                });
              return;
            }
          }
          this.gtppost = {
            EnterpriseObj: this.emp,
            ListServiceObj: this.scv,
          };
        });
      }
    } else {
      this.mensaje(
        'Aprobacion',
        'Aun faltan aprobar ' + total + ' observaciones'
      );
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
    if (svc.name === '?' && svc.newName !== '?') {
      if (svc.newName.substring(0, 3).toString() === '???') {
        return svc.newName.substring(3, svc.newName.length).toString();
      }
      return svc.newName;
    }
    if (svc.name !== '?' && svc.newName !== '?') {
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
    if (svc.newNameGTPStatus === 0 && svc.newNameCodeGTPStatus === 0) {
      return svc.newName;
    } else {
      return svc.name === null ? svc.newName : svc.name;
    }
  }

  getStateEnterprise(Enterprise: DataEnterpriseGTP) {
    //
    if (Enterprise.newNameGTPStatus === 0) {
      return 'Nueva Empresa';
    }
    if (Enterprise.newNameGTPStatus === 1) {
      return 'Empresa Habilitada';
    }
    if (Enterprise.newNameGTPStatus === 2) {
      return 'Empresa Editada';
    }
    if (Enterprise.newNameGTPStatus === 3) {
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

  getState(svc: DataServiceGTP) {
    if (svc.newNameGTPStatus === 0 || svc.newNameCodeGTPStatus === 0) {
      return 'Nuevo servicio';
    }
    if (svc.newNameGTPStatus === 1 && svc.newNameCodeGTPStatus === 1) {
      return 'Servicio habilitado';
    }
    if (svc.newNameGTPStatus === 2 || svc.newNameCodeGTPStatus === 2) {
      return 'Servicio editado';
    }
    if (svc.newNameGTPStatus === 3 || svc.newNameCodeGTPStatus === 3) {
      return 'Servicio rechazado';
    }
  }
  OcultarFormulario() {
    if (
      this.Empgtp.newNameGTPStatus === 0 ||
      this.Empgtp.newNameGTPStatus === 2
    ) {
      Swal.fire({
        title: 'Descartar Cambios',
        text: 'Se van a descartar los cambios.',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'DESCARTAR',
        cancelButtonText: 'REGRESAR',
        onOpen: drawPopup,
      }).then((r) => {
        if (r.value) {
          this.Formulario = false;
        }
      });
    } else {
      this.Formulario = false;
    }
  }

  OcultarFormularioSer() {
    if (
      this.Servgtp.newNameGTPStatus === 0 ||
      this.Servgtp.newNameGTPStatus === 2 ||
      this.Servgtp.newNameCodeGTPStatus === 0 ||
      this.Servgtp.newNameCodeGTPStatus === 2
    ) {
      Swal.fire({
        title: 'Descartar Cambios',
        text: 'Se van a descartar los cambios.',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'DESCARTAR',
        cancelButtonText: 'REGRESAR',
        onOpen: drawPopup,
      }).then((r) => {
        if (r.value) {
          this.indiceActual = -1;
          this.ServiciosFormulario = false;
        }
      });
    } else {
      this.indiceActual = -1;
      this.ServiciosFormulario = false;
    }
  }

  mensaje(titulo: string, text: string) {
    Swal.fire({
      // type: tipo ,
      title: titulo,
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
