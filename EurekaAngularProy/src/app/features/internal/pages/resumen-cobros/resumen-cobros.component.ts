import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFullRoutingNames } from 'src/app/app-routing.collection';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import {
  internalAuthFullRoutingNames,
  internalFullRoutingNames,
  internalRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-resumen-cobros',
  templateUrl: './resumen-cobros.component.html',
  styleUrls: ['./resumen-cobros.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #fff;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px !important;
        padding: 0.5em 0.3em;
        min-width: 300px !important;
      }

      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
      }
    `,
  ],
})
export class ResumenCobrosComponent implements OnInit {
  servicio_length = 0;
  public indiceActual = -1;
  public inGTP = false;
  Formulariogtp = false;
  Formulario = false;
  public stateCreate = false;
  public stateEdit = false;
  serviceActual: ServiceModel = null;
  public inEdit = false;
  public affiliationFlow = false;
  sendAfterSave = false;
  public onFormAction: EventEmitter<string> = new EventEmitter();
  addNewAfterSave = false;

  constructor(
    public afiliacionService: AfiliacionService,
    private gaService: GoogleAnalytics,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.afiliacionService.IniciarServicios();
    this.route.data.subscribe((d) => {
      this.inEdit = d.isEdit;
      this.inGTP = d.isgtp;
      this.affiliationFlow = d.affiliationFlow;

      if (d.isEdit) {
        window['_url_loop_'] = internalRoutingNames.CHARGES;
        if (this.afiliacionService.services.length === 0) {
          this.afiliacionService.GetServicios();
          setTimeout(() => {
            this.servicio_length = this.afiliacionService.services.length;
          }, 3000);
        } else {
          this.servicio_length = this.afiliacionService.services.length;
        }
      } else {
        window['_url_loop_'] = internalAuthFullRoutingNames.CHARGES_AFFILIATION;
        history.pushState(
          null,
          null,
          internalAuthFullRoutingNames.CHARGES_AFFILIATION
        );
        this.servicio_length = this.afiliacionService.services.length;
      }
    });
  }

  getNameGTP(svc: ServiceModel) {
    if (svc.newNameGtpStatus === 1) {
      return svc.nombre;
    }
    if (svc.newNameGtpStatus === 3) {
      return svc.newName;
    }
  }

  editService(svc: ServiceModel, index: number) {
    if (this.Formulario && this.indiceActual !== index) {
      /*Swal.fire({
        type: 'warning',
        title: 'Edición del Servicio',
        text: 'Actualmente esta editando un servicio. Debe guardar o descartar los cambios',
        showCloseButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'CERRAR'
      });*/
      return;
    }
    if (this.Formulariogtp && this.indiceActual !== index) {
      return;
    }

    if (this.inGTP) {
      this.Formulariogtp = true;
      this.stateEdit = true;
      this.stateCreate = false;
      this.indiceActual = index;
      this.serviceActual = svc;
      return;
    }
    this.stateEdit = true;
    this.stateCreate = false;
    this.indiceActual = index;
    //this.serviceActual = svc;
    this.afiliacionService.currentServiceModel = svc;
    this.afiliacionService.currentIndex = index;
    this.goEditCharge();
    this.Formulario = true;
  }

  goEditCharge() {
    if (this.affiliationFlow) {
      this.router.navigate([
        internalAuthFullRoutingNames.CHARGES_AFFILIATION_EDIT,
      ]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES_EDIT]);
    }
  }

  getName(svc: ServiceModel) {
    if (svc.newNameGtpStatus === 3 && svc.nombre === null) {
      return svc.newName;
    }
    if (svc.newNameGtpStatus === 0) {
      return svc.newName;
    }
    return svc.nombre;
  }

  delService(index: number) {
    if (this.Formulario) {
      /*Swal.fire({
        type: 'warning',
        title: 'Eliminación del Servicio',
        text: 'Actualmente esta editando un servicio. Debe guardar o descartar los cambios',
        showCloseButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'CERRAR'
      });*/
      return;
    }
    if (this.inEdit && this.afiliacionService.services[index].id) {
      this.afiliacionService.CanDeleteService(index).subscribe((r) => {
        let title = 'Eliminación total del servicio';
        let msg =
          'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio';
        if (r.hasPayed) {
          title = 'Eliminación Parcial del Servicio';
          msg =
            'Ya existe un historial de pagos realizados con este servicio, sólo se eliminarán las deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
        }
        Swal.fire({
          text: msg,
          title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'CONFIRMAR',
          cancelButtonText: 'CANCELAR',
          onOpen: drawPopup,
        }).then((r) => {
          if (r.value) {
            this.afiliacionService.SendDelService(index).subscribe((r) => {
              this.gaService.sendEvent('ServicioEliminado', {
                event_category: GoogleAnalytics.Dashboard,
                event_label: 'servicio_eliminado',
              });
              Swal.fire({
                text: 'Se ha eliminado el Servicio',
                title,
                onOpen: drawPopup,
              });
            });
            setTimeout(() => {
              this.servicio_length = this.afiliacionService.services.length;
            }, 2000);
          }
        });
      });
    } else {
      Swal.fire({
        text: 'Se eliminará el servicio de los canales de interbank',
        title: 'Eliminación total el servicio',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
        allowOutsideClick: false,
        onOpen: drawPopup,
      }).then((r) => {
        if (r.value) {
          this.afiliacionService.DelService(index);
          this.gaService.sendEvent('ServicioEliminado', {
            event_category: GoogleAnalytics.Afiliacion,
            event_label: 'servicio_eliminado',
          });

          setTimeout(() => {
            this.servicio_length = this.afiliacionService.services.length;
          }, 2000);
        }
      });
    }
  }

  pendienteRevision(svc: ServiceModel) {
    if (this.inEdit) {
      if (svc.id === null) {
        return true;
      }
      if (svc.newName !== '' || svc.newNameCode !== '') {
        return true;
      }
      if (
        svc.newNameGtpStatus === 1 &&
        svc.newNameCodeGtpStatus === 1 &&
        svc.newName === ''
      ) {
        return false;
      }
      // tslint:disable-next-line:max-line-length
      if (
        (svc.newNameGtpStatus === 0 || svc.newNameGtpStatus === 2) &&
        (svc.newNameCodeGtpStatus === 0 || svc.newNameCodeGtpStatus === 2)
      ) {
        return true;
      }
    } else {
      return false;
    }
  }

  getCanales(svc: ServiceModel) {
    let str = '';
    if (svc.usaWebApp) {
      str += 'Digital';
    }
    if (svc.usaAgente) {
      str += (str !== '' ? ', ' : '') + 'Agentes';
    }
    if (svc.usaTienda) {
      str += (str !== '' ? ', ' : '') + 'Tiendas';
    }

    return str;
  }

  getCodDebtorCreate(svc: ServiceModel) {
    if (
      svc.codDeudor === 'RUC' ||
      svc.codDeudor === 'DNI' ||
      svc.codDeudor === 'Codigo Interno'
    ) {
      return svc.codDeudor;
    }
    if (svc.codDeudor === 'Otro') {
      return svc.nameCod;
    }
  }

  getCodigoNameGTP(svc: ServiceModel) {
    if (svc.newNameCodeGtpStatus === 1) {
      if (svc.codDeudor === 'Otro') {
        return svc.nameCod;
      }
      return svc.codDeudor;
    }
    if (svc.newNameCodeGtpStatus === 3) {
      return svc.newNameCode;
    }
  }

  getCodDebtor(svc: ServiceModel) {
    if (svc.newNameCodeGtpStatus === 0) {
      return svc.newNameCode;
    }
    if (svc.newNameCodeGtpStatus === 1) {
      return svc.codDeudor;
    }
    if (svc.newNameCodeGtpStatus === 3) {
      if (svc.codDeudor == null || svc.nameCod !== '') {
        return svc.newNameCode;
      } else {
        return svc.codDeudor;
      }
    } else {
      if (
        svc.codDeudor === 'RUC' ||
        svc.codDeudor === 'DNI' ||
        svc.codDeudor === 'Codigo Interno'
      ) {
        return svc.codDeudor;
      }
    }
    if (svc.codDeudor === 'Otro' && svc.nameCod !== svc.newNameCode) {
      return svc.nameCod;
    }
    if (svc.codDeudor === 'Otro' || svc.nameCod !== svc.newNameCode) {
      // return svc.nameCod;
      return svc.nameCod;
    }
  }

  DisableAgregarServicio(): boolean {
    if (this.Formulario) return true;
    if (this.inEdit && this.afiliacionService.services.length == 0) return true;
    return false;
  }

  MostarFormulario() {
    if (this.afiliacionService.services.length >= 99) {
      Swal.fire({
        text: 'Usted solo puede tener 99 servicios como máximo',
        onOpen: drawPopup,
      });
      return;
    }

    const svcSinCta = this.afiliacionService.services.find(
      (v) => v.nroCuenta === ''
    );
    if (svcSinCta) {
      Swal.fire({
        text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
        onOpen: drawPopup,
      });
      return;
    }

    this.indiceActual = this.afiliacionService.services.length;
    this.afiliacionService.createNewService(this.getUseAgencyChannel());
    this.nextPage();
    this.stateEdit = true;
    this.stateCreate = true;
    this.Formulario = true;
    // }
  }

  nextPage() {
    if (this.affiliationFlow === true) {
      this.router.navigate([
        internalAuthFullRoutingNames.CHARGES_AFFILIATION_ADD_STEP_1,
      ]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES_ADD_STEP_1]);
    }
  }

  getUseAgencyChannel(): boolean {
    var useAgencyChannel: boolean = false;
    if (this.afiliacionService.services.length > 0) {
      useAgencyChannel = this.afiliacionService.services[0].useAgencyChannel;
    }
    return useAgencyChannel;
  }

  EnviarServicios() {
    // GTP
    if (this.inGTP) {
    } else {
      if (this.Formulario === true) {
        Swal.fire({
          title: 'Servicio no guardado',
          text: `Guarde los cambios del servicio ${
            this.serviceActual === null ? '' : this.serviceActual.nombre
          } para poder continuar al siguiente paso`,
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'DESHACER CAMBIOS',
          confirmButtonText: 'GUARDAR',
          onOpen: drawPopup,
        }).then((r) => {
          this.sendAfterSave = true;
          if (r.value) {
            this.onFormAction.emit('save');
          } else if (r.dismiss === Swal.DismissReason.cancel) {
            this.OcultarFormulario(false);
          } else {
            this.sendAfterSave = false;
          }
        });
        return;
      }
      // this.frm.get('monto').value

      let svcSinCta = this.afiliacionService.services.find(
        (v) => v.nroCuenta === ''
      );
      if (svcSinCta) {
        Swal.fire({
          text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
          onOpen: drawPopup,
        });
        return;
      }
      this.gaService.sendEvent('EnviarServicios', {
        event_category: this.inEdit
          ? GoogleAnalytics.Dashboard
          : GoogleAnalytics.Afiliacion,
        event_label: 'enviar_servicios',
      });
      this.gaService.sendUrl('servicioNuevo', '/servicioNuevo');
      this.afiliacionService.GrabarServicios().subscribe((r) => {
        if (this.inEdit) {
          this.router.navigate([internalFullRoutingNames.HOME]);
          /*for(let i=0; i<this.afiliacionService.services.length; i++) {
              if (this.afiliacionService.services[i].inReview == false) {
                return;
              }
            }
            this.router.navigate([authFullRoutingNames.PROCESSING]);*/
        } else {
          this.router.navigate([authFullRoutingNames.PROCESSING]);
        }
      });
    }
  }

  OcultarFormulario(requireConfirm: boolean) {
    if (requireConfirm) {
      Swal.fire({
        title: 'Descartar cambios',
        text: 'Se van a descartar los cambios.',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'DESCARTAR',
        cancelButtonText: 'REGRESAR',
        onOpen: drawPopup,
      }).then((r) => {
        if (r.value) {
          this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
          this.Formulario = false;
          this.stateCreate = false;
          this.stateEdit = false;
          this.addNewAfterSave = false;
          this.sendAfterSave = false;
          this.indiceActual = -1;
          this.Formulariogtp = false;
        }
      });
    }
    /* else {
       this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
       this.Formulario = false;
       this.stateCreate = false;
       this.stateEdit =false;
       if (this.addNewAfterSave && this.indiceActual > 0) {
         setTimeout(() => this.MostarFormulario(), 600);
       }
       else if (this.sendAfterSave) {
         setTimeout(() => this.EnviarServicios(), 600);
       }
       this.indiceActual = -1;
       this.addNewAfterSave = false;
       this.sendAfterSave = false;
     } */
  }

  goBack() {
    this.router.navigate([internalFullRoutingNames.HOME]);
  }
}
