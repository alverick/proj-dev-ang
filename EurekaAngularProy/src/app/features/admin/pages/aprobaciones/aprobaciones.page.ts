import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clone, equals, isNil } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { appFullRoutingNames } from 'src/app/app-routing.names';
import { IEntryModel } from 'src/app/shared/models';
import { ICompanyData } from 'src/app/shared/models/company-data';
import { GtpEmpresa, GtpServcegtp } from 'src/app/shared/models/gtp-post';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { IAccountStateDetails } from '../../../../shared/models/company';
import { DataServiceGTP } from '../../../../shared/models/data-service-gtp';

@Component({
  selector: 'cs-aprobaciones',
  templateUrl: './aprobaciones.page.html',
  styleUrls: ['./aprobaciones.page.scss'],
})
export class AprobacionesPage implements OnInit {
  public Formulario = false;
  public ServiciosFormulario = false;
  public llave: string;
  public Empgtp: ICompanyData = null;
  public Enterprise: ICompanyData = {
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
  public Service: DataServiceGTP;
  public Servgtp: DataServiceGTP;
  public indiceActual = -1;
  public rubro: string;
  public empresa: any;
  enterpriseChanged = false;
  servicesChanged = false;
  stateDetail: IAccountStateDetails;

  rubros: IEntryModel[] = [];

  constructor(
    public gtpService: GtpService,
    private activatedRoute: ActivatedRoute,
    public afiliacionService: AfiliacionService,
    public router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (this.Formulario && this.ServiciosFormulario) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ stateDetail }) => {
      this.stateDetail = stateDetail;
    });
    this.llave = this.activatedRoute.snapshot.params.llave;
    /// TRAE LOS SERVICIOS
    this.afiliacionService.GetRubrosAll().subscribe((d) => {
      this.rubros = d;
      this.loadEnterpriseData();
    });
  }

  loadEnterpriseData() {
    this.enterpriseChanged = false;
    this.servicesChanged = false;
    this.gtpService.GetServicesGtp(this.llave);
    this.getInfoEmpresa();
  }

  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.llave).subscribe((dataEnterprise) => {
      this.Enterprise = dataEnterprise;
      this.rubro = this.rubros.find(
        (v) => v.code === this.Enterprise.entry
      ).name;
    });
  }

  onGrabar(enterpriseData: ICompanyData) {
    this.Formulario = false;
    if (!equals(this.Enterprise, enterpriseData)) {
      this.Enterprise = enterpriseData;
      this.enterpriseChanged = true;
    }
  }

  onGrabarSer(etp: DataServiceGTP) {
    if (
      this.indiceActual >= 0 &&
      !equals(etp, this.gtpService.services[this.indiceActual])
    ) {
      this.Service = etp;
      this.ServiciosFormulario = false;
      this.gtpService.services[this.indiceActual] = etp;
      this.indiceActual = -1;
      this.servicesChanged = true;
    }
  }

  VerCamposEnterprise(etp: ICompanyData) {
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
    this.Servgtp = clone(etp);
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

  EnviarAprobados() {
    let entryDiff = false;
    this.gtpService.services.forEach(({ res }) => {
      if (res.length > 0 && res.substring(0, 2) !== this.Enterprise.entry) {
        entryDiff = true;
      }
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
      ({ acceptednewName }) => acceptednewName === false
    ).length;
    const CodDeuApp = this.gtpService.services.filter(
      ({ acceptednewNameCode }) => acceptednewNameCode === false
    ).length;

    // tslint:disable-next-line: max-line-length cunatos son los que faltan revisar
    const ListCantidadNombre = this.gtpService.services.filter(
      ({ acceptednewName, newNameGTPStatus }) =>
        (newNameGTPStatus === 0 || newNameGTPStatus === 2) &&
        acceptednewName === null
    ).length;
    // tslint:disable-next-line:max-line-length
    const ListCantidadCodigoDeudor = this.gtpService.services.filter(
      ({ acceptednewNameCode, newNameCodeGTPStatus }) =>
        (newNameCodeGTPStatus === 0 || newNameCodeGTPStatus === 2) &&
        acceptednewNameCode === null
    ).length;

    let Empcant = 0;
    // duplica por que calcula por los 2 la cantidad que falta

    if (
      this.Enterprise.name.toUpperCase() ===
      this.Enterprise.newName.toUpperCase()
    ) {
      this.Enterprise.NombreApproved = true;
    } else {
      if (isNil(this.Enterprise.NombreApproved)) {
        Empcant = 1;
      }
    }

    const totalObservations =
      ListCantidadNombre + ListCantidadCodigoDeudor + Empcant;

    let desap = 0;
    if (this.Enterprise.NombreApproved === false) {
      desap = 1;
    }
    const notApproved = CodDeuApp + nombreApp + desap;
    const { NombreApproved } = this.Enterprise;
    this.emp = {
      ClientId: parseInt(this.llave, 10),
      NombreAprobado: NombreApproved,
    };
    this.scv = this.gtpService.services
      .filter(
        ({ newNameCodeGTPStatus, newNameGTPStatus, res }) =>
          newNameGTPStatus === 2 ||
          newNameGTPStatus === 0 ||
          newNameCodeGTPStatus === 2 ||
          newNameCodeGTPStatus === 0 ||
          res !== ''
      )
      .map(({ acceptednewName, acceptednewNameCode, id, res }) => ({
        ServiceId: id,
        NombreAprobado: acceptednewName,
        NombreCodAprobado: acceptednewNameCode,
        Res: res,
      }));

    this.processDataEnterprise(totalObservations, notApproved);
  }

  private processDataEnterprise(observations: number, notApproved: number) {
    const { isNewEnterprise, inReview, name, newName } = this.Enterprise;

    const servicesInReview = this.gtpService.services.some(
      (service) => service.inReview
    );

    if (observations !== 0) {
      this.mensaje(
        'Aprobación',
        `Aun faltan aprobar ${observations} observaciones`
      );
      return;
    }
    if (notApproved > 0) {
      if (isNewEnterprise) {
        Swal.fire({
          title: 'Aprobación',
          html: `Existen ${notApproved} campos que no fueron aprobados. <br> ¿Desea rechazar la Afiliación?`,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, Rechazar afiliación',
          cancelButtonText: 'No, Solicitar corrección de datos',
          onOpen: drawPopup,
        }).then(async (result) => {
          if (result.value) {
            this.saveApprovedData({
              Rechaza: true,
              EnterpriseObj: this.emp,
              ListServiceObj: this.scv,
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            await this.saveQueryFixData();
          }
        });
      } else {
        Swal.fire({
          title: 'Aprobación',
          html: `Existen ${notApproved} campos que no fueron aprobados. <br> ¿Desea solicitar corrección de datos?`,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, Solicitar corrección de datos',
          cancelButtonText: 'No, Cancelar',
          onOpen: drawPopup,
        }).then(async (result) => {
          if (result.value) {
            await this.saveQueryFixData();
          }
        });
      }
    } else if (
      name === newName &&
      inReview === false &&
      !servicesInReview &&
      (this.enterpriseChanged || this.servicesChanged)
    ) {
      Swal.fire({
        title: 'Confirmar cambios',
        html: '¿Estás seguro de que quieres guardar estos cambios?',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, Terminar',
        cancelButtonText: 'No, Cancelar',
        onOpen: drawPopup,
      }).then(async (result) => {
        if (result.value) {
          if (this.enterpriseChanged) {
            await this.saveCompanyData({
              EnterpriseObj: null,
              ListServiceObj: this.scv,
            });
          } else {
            this.saveApprovedData({
              EnterpriseObj: null,
              ListServiceObj: this.scv,
            });
          }
        } else {
          this.router.navigate([appFullRoutingNames.ADMIN]);
        }
      });
    } else if (!this.enterpriseChanged && !this.servicesChanged) {
      this.router.navigate([appFullRoutingNames.ADMIN]);
    } else {
      Swal.fire({
        title: 'Aprobación',
        html: 'Todos los campos han sido revisados <br> ¿Desea terminar? <br> (Se enviará un correo a la empresa)',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si, Terminar',
        cancelButtonText: 'No, Cancelar',
        onOpen: drawPopup,
      }).then(async (result) => {
        if (result.value) {
          if (name === newName) {
            if (inReview === false && this.scv.length === 0) {
              this.router.navigate([appFullRoutingNames.ADMIN]);
              return;
            }
            if (inReview && this.scv.length > 0) {
              this.saveApprovedData({
                EnterpriseObj: this.emp,
                ListServiceObj: this.scv,
              });
              return;
            }
            if (inReview === false) {
              if (this.enterpriseChanged) {
                await this.saveCompanyData({
                  EnterpriseObj: null,
                  ListServiceObj: this.scv,
                });
              } else {
                this.saveApprovedData({
                  EnterpriseObj: null,
                  ListServiceObj: this.scv,
                });
              }
              return;
            }
          }
          if (this.scv.length === 0) {
            this.saveApprovedData({
              EnterpriseObj: this.emp,
              ListServiceObj: null,
            });
            return;
          } else {
            this.saveApprovedData({
              EnterpriseObj: this.emp,
              ListServiceObj: this.scv,
            });
            return;
          }
        }
      });
    }
  }

  private async saveQueryFixData() {
    const { inReview, name, newName } = this.Enterprise;

    if (this.enterpriseChanged && !inReview) {
      await this.saveCompanyData();
    }

    if (name === newName) {
      if (
        (inReview === false && this.scv.length === 0) ||
        (inReview && this.scv.length > 0)
      ) {
        this.saveApprovedData({
          Rechaza: false,
          EnterpriseObj: this.emp,
          ListServiceObj: this.scv,
        });
        return;
      }
      if (inReview === false) {
        this.saveApprovedData({
          Rechaza: false,
          EnterpriseObj: null,
          ListServiceObj: this.scv,
        });
        return;
      }
    }
    if (this.scv.length === 0) {
      this.saveApprovedData({
        Rechaza: false,
        EnterpriseObj: this.emp,
        ListServiceObj: null,
      });
    } else {
      this.saveApprovedData({
        Rechaza: false,
        EnterpriseObj: this.emp,
        ListServiceObj: this.scv,
      });
    }
  }

  private saveCompanyData(serviceData = null, redirect = false) {
    return new Promise<void>((resolve) => {
      const { email, movilNumber } = this.Enterprise;
      const companyData = {
        email,
        movilNumber,
        clientID: parseInt(this.llave, 10),
      };

      this.gtpService.saveDatosEmpresa(companyData).subscribe({
        next: () => {
          this.enterpriseChanged = false;
        },
        complete: () => {
          if (this.servicesChanged && isNotNil(serviceData)) {
            this.saveApprovedData(serviceData);
          }
          if (redirect || (!this.servicesChanged && isNotNil(serviceData))) {
            this.router.navigate([appFullRoutingNames.ADMIN]);
          }
          resolve();
        },
      });
    });
  }

  saveApprovedData(approveData) {
    if (
      isNotNil(approveData) &&
      (this.servicesChanged || isNotNil(this.Enterprise.NombreApproved))
    ) {
      this.gtpService
        .AprobarEmpresaServ(approveData)
        .subscribe(this.setNavigate());
    }
  }

  private setNavigate() {
    return (response) => {
      this.servicesChanged = false;
      if (response) {
        this.router.navigate([appFullRoutingNames.ADMIN]);
      }
    };
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

  getStateEnterprise(Enterprise: ICompanyData) {
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
      text,
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
