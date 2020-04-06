import { Component, OnInit, EventEmitter, HostListener, ɵConsole } from '@angular/core';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormServicioComponent } from '../form-servicio/form-servicio.component';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { ServicesGTPChange } from 'src/app/shared/models/data-gtpchange';
import { DataServiceGTP } from 'src/app/shared/models/data-service-gtp';

@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #FFF;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.20);
        font-size: 11px !important;
        padding: .5em .3em;
        /* min-width:300px !important; */
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
      }
    `
  ]
})
export class ConfigurarServiciosComponent implements OnInit {

  protected ruc: number;
  public stateCreate: boolean = false;
  public stateEdit: boolean = false;
  public input: FormServicioComponent;
  Formulario: boolean = false;
  Formulariogtp: boolean = false;
  buttonServicios = '';
  public inEdit: boolean = false;
  public inGTP: boolean = false;
  public titulo: string;
  public SvcEdit: ServicesGTPChange[];
  public onFormAction: EventEmitter<string> = new EventEmitter();

  constructor(public afiliacionService: AfiliacionService,
    private route: ActivatedRoute,
    private router: Router,
    private gaService: GoogleAnalytics,
    public gtpService: GtpService) { }

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (!this.afiliacionService.Guardado) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.afiliacionService.IniciarServicios();
    this.afiliacionService.services = [];
    this.route.data.subscribe(d => {
      this.inEdit = d.isEdit;
      this.inGTP = d.isgtp;
      if (d.isgtp === true) {
        /////////////////////////PORTAL GTP //////////////////////////////////////

        window['_url_loop_'] = 'editarSvcGTP';
        history.pushState(null, null, 'editarSvcGTP');
        this.afiliacionService.services = [];
        this.gtpService.EmpresaServicios.arrayServices.forEach(s => {
          this.afiliacionService.services.push({
            id: s.id,
            nombre: s.name,
            res: s.res === null ? '' : s.res,
            newName: s.newName,
            newNameCode: s.newNameCode,
            codDeudor: s.debtorCode,
            tipoDato: s.dataType,
            tipoPago: s.paymentType,
            idCuenta: s.idAccount,
            nroCuenta: s.accountNumber,
            moneda: s.currency,
            simboloMoneda: s.currencySymbol,
            usaWebApp: s.useAppWeb,
            usaAgente: s.useAgent,
            usaTienda: s.useStore,
            cobraMora: s.chargeInterest,
            periodoMora: s.chargeType.toString(),
            tipoMora: s.interestType,
            monto: s.amount,
            porcentaje: s.porcentage,
            inReview: s.inReview,
            pagoPartes: s.partialPayment,
            status: s.status,
            nombreHabilitado: (s.newNameGTPStatus === 3) ? false : true,
            nombreCodHabilitado: (s.newNameCodeGTPStatus === 3) ? false : true,
            newNameGtpStatus: s.newNameGTPStatus,
            newNameCodeGtpStatus: s.newNameCodeGTPStatus
          });
        });
        return;
      }

      if (d.isEdit) {
        window['_url_loop_'] = 'editarServicios';
        this.afiliacionService.GetServicios();
        this.buttonServicios = 'Actualizar';
        this.titulo = 'Edita el servicio';

      } else {
        window['_url_loop_'] = 'configurarServicios';
        history.pushState(null, null, 'configurarServicios');
        this.afiliacionService.Clear();
        this.buttonServicios = 'Guardar';
        this.editService(this.afiliacionService.services[0], 0);
        this.titulo = 'Agrega un nuevo servicio';
      }
    });
    console.log('afiliacionService.services', this.afiliacionService.services)

  }

  public indiceActual: number = -1;
  serviceActual: ServiceModel = null;

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
        onOpen: drawPopup
      }).then(r => {
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


  addNewAfterSave: boolean = false;
  sendAfterSave: boolean = false;

  MostarFormulario() {
    if (this.afiliacionService.services.length >= 99) {
      Swal.fire({
        text: 'Usted solo puede tener 99 servicios como máximo',
        onOpen: drawPopup
      });
      return;
    }

    let svcSinCta = this.afiliacionService.services.find((v) => v.nroCuenta === '');
    if (svcSinCta) {
      Swal.fire({
        text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
        onOpen: drawPopup
      });
      return;
    }

    if (this.Formulario) {
      Swal.fire({
        title: 'Servicio no guardado',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'GUARDAR',
        cancelButtonText: 'DESHACER CAMBIOS',
        onOpen: drawPopup
      }).then(r => {
        this.addNewAfterSave = true;
        if (r.value) {
          this.onFormAction.emit('save');
        }
        else if (r.dismiss === Swal.DismissReason.cancel) {
          this.OcultarFormulario(false);
        }
        else {
          this.addNewAfterSave = false;
        }
      });
    }
    else {
      this.indiceActual = this.afiliacionService.services.length;
      this.serviceActual = this.afiliacionService.CrearSevice();
      this.stateEdit = true;
      this.stateCreate = true;
      this.Formulario = true;
    }
  }



  EnviarServicios() {

    // GTP
    if (this.inGTP) {

      let Svc = [];
      let svcinReview = this.afiliacionService.services.filter((v) => v.newNameGtpStatus === 3 || v.newNameCodeGtpStatus === 3);
      let cantName = this.afiliacionService.services.filter((v) => (v.inReview === true) && (v.nombre === '?')).length;
      let cantNameServ = this.afiliacionService.services.filter((v) => (v.inReview === true) && (v.codDeudor === '?')).length;
      let total = cantName + cantNameServ;

      svcinReview.forEach(s => {
        Svc.push({
          ServiceId: s.id,
          NewName: (s.newNameGtpStatus === 1) ? null : s.newName,
          NewCodName: (s.newNameCodeGtpStatus === 1) ? null : s.newNameCode,
        });
      });

      if (total === 0) {
        this.sendAfterSave = true;
        if (Svc.length === 0) {
          this.gtpService.EditChangeGTP({
            Token: this.gtpService.EdtEmpServ.token,
            NewName: this.gtpService.EdtEmpServ.NewName, ArrayServices: null
          })
            .subscribe(d => {
              if (d === true) {
                this.router.navigate(['/procesando']);
              } else {
              }

            });

        } else {
          this.gtpService.EditChangeGTP({
            Token: this.gtpService.llave,
            NewName: this.gtpService.nombre, ArrayServices: Svc
          })
            .subscribe(d => {
              if (d === true) {
                this.router.navigate(['/procesando']);
              } else {
              }
            });
        }
      } else {
        this.mensaje('Correxiones', 'Aun faltan corregir ' + total + ' observaciones');
      }
    }

    else {

      if (this.Formulario === true) {
        Swal.fire({
          title: 'Servicio no guardado',
          text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'DESHACER CAMBIOS',
          confirmButtonText: 'GUARDAR',
          onOpen: drawPopup
        }).then(r => {
          this.sendAfterSave = true;
          if (r.value) {
            this.onFormAction.emit('save');
          }
          else if (r.dismiss === Swal.DismissReason.cancel) {
            this.OcultarFormulario(false);
          }
          else {
            this.sendAfterSave = false;
          }
        });
        return;
      }
      // this.frm.get('monto').value

      let svcSinCta = this.afiliacionService.services.find((v) => v.nroCuenta === '');
      if (svcSinCta) {
        Swal.fire({
          text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
          onOpen: drawPopup
        });
        return;
      }
      this.gaService.sendEvent('EnviarServicios', {
        'event_category': GoogleAnalytics.Afiliacion,
        'event_label': 'enviar_servicios'
      });
      this.afiliacionService.GrabarServicios()
        .subscribe(r => {
          if (this.inEdit) {
            this.router.navigate(['/home']);
            /*for(let i=0; i<this.afiliacionService.services.length; i++) {
              if (this.afiliacionService.services[i].inReview == false) {
                return;
              }
            }
            this.router.navigate(['/procesando']);*/
          }
          else {
            this.router.navigate(['/procesando']);
          }
        });

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

  getCanales(svc: ServiceModel) {
    let str = '';
    if (svc.usaWebApp) {
      str += "Digital"
    }
    if (svc.usaAgente) {
      str += (str !== '' ? ', ' : '') + "Agentes"
    }
    if (svc.usaTienda) {
      str += (str !== '' ? ', ' : '') + "Tiendas"
    }

    return str;
  }

  /*getCodDebtor2(svc: ServiceModel) {

      if(svc.codDeudor === svc.newNameCode) {
         return svc.newNameCode;
      }
      if (svc.codDeudor === '?') {
        if (svc.newNameCode.substring(0, 3) === '???') {
         return svc.newNameCode.substring(3, svc.newNameCode.length);
       }
       return svc.newNameCode;
     } else {
      if (svc.codDeudor   === 'RUC' || svc.codDeudor  === 'DNI' || svc.codDeudor === 'Codigo Interno') {
          return svc.codDeudor;
      }
      }
      if((svc.codDeudor  === 'Otro' ) && (svc.nameCod !== svc.newNameCode)) {
            return svc.nameCod;
      }
      if((svc.codDeudor  === 'Otro' ) || (svc.nameCod !== svc.newNameCode)) {
        // return svc.nameCod;
         return svc.codDeudor;
     }
  } */

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
      if (svc.codDeudor === 'RUC' || svc.codDeudor === 'DNI' || svc.codDeudor === 'Codigo Interno') {
        return svc.codDeudor;
      }
    }
    if ((svc.codDeudor === 'Otro') && (svc.nameCod !== svc.newNameCode)) {
      return svc.nameCod;
    }
    if ((svc.codDeudor === 'Otro') || (svc.nameCod !== svc.newNameCode)) {
      // return svc.nameCod;
      return svc.nameCod;
    }
  }


  getCodDebtorCreate(svc: ServiceModel) {
    if (svc.codDeudor === 'RUC' || svc.codDeudor === 'DNI' || svc.codDeudor === 'Codigo Interno') {
      return svc.codDeudor;
    }
    if (svc.codDeudor === 'Otro') {
      return svc.nameCod;
    }
  }

  /*getNameGTP2(svc: ServiceModel) {
    if (svc.nombre  !== '?') {
      return svc.nombre;
   }
    if (svc.nombre  === '?') {
      return svc.newName.substring(3, svc.newName.length).toString();
   }
  } */
  getNameGTP(svc: ServiceModel) {
    if (svc.newNameGtpStatus === 1) {
      return svc.nombre;
    }
    if (svc.newNameGtpStatus === 3) {
      return svc.newName;
    }
  }
  /* pendienteRevision2(svc: ServiceModel) {
   if (this.inEdit ) {
    if (svc.id === null) {
      return true;
    }
     if ((svc.nombre === svc.newName) && ((svc.codDeudor  === svc.newNameCode ) || (svc.nameCod  === svc.newNameCode ) )) {
      return false;
     }
    if (((svc.nombre !== svc.newName) && (svc.nombre === '?')) || ((svc.codDeudor  !== svc.newNameCode ) && (svc.codDeudor === '?') )) {
      return true;
    }
  
    if ((svc.nombre !== svc.newName) || ((svc.nameCod  !== svc.newNameCode) ||
     (svc.codDeudor  !== svc.newNameCode)  )) {
      return true;
    }
   } else {
    return false;
   }
  } */

  pendienteRevision(svc: ServiceModel) {
    if (this.inEdit) {

      if (svc.id === null) {
        return true;
      }
      if (svc.newName !== '' || svc.newNameCode !== '') {
        return true;
      }
      if (svc.newNameGtpStatus === 1 && svc.newNameCodeGtpStatus === 1 && svc.newName === '') {
        return false;
      }
      // tslint:disable-next-line:max-line-length
      if (((svc.newNameGtpStatus === 0) || (svc.newNameGtpStatus === 2)) && ((svc.newNameCodeGtpStatus === 0) || (svc.newNameCodeGtpStatus === 2))) {
        return true;
      }
    } else {
      return false;
    }
  }


  /*
       newName         name
     minimarket         ''       NUEVO     0  -
     minimarket         ''       RECHAZADO 3  -
       ''            minimarket  APROBADO  1
       sm            minimarket  EDITADO   2
       sm            minimarket  RECHAZADO 3
       ''               sm       APROBADO  1
   */
  /* getName2(svc: ServiceModel) {
    if (svc.nombre === '?') {
      if (svc.newName.substring(0, 3) === '???') {
        return svc.newName.substring(3, svc.newName.length);
      } else {
        return svc.newName;
      }
    }
    return svc.nombre;
  }  */
  getName(svc: ServiceModel) {
    if (svc.newNameGtpStatus === 3 && svc.nombre === null) {
      return svc.newName;
    }
    if (svc.newNameGtpStatus === 0) {
      return svc.newName;
    }
    return svc.nombre;
  }

  getCodigoNameGTP2(svc: ServiceModel) {
    if (svc.codDeudor !== '?') {
      if (svc.codDeudor === 'Otro') {
        return svc.nameCod;
      }
      return svc.codDeudor;
    }
    if (svc.codDeudor === '?') {
      return svc.newNameCode.substring(3, svc.newNameCode.length).toString();
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
      this.afiliacionService.CanDeleteService(index).subscribe(r => {
        let title = 'Eliminación total del servicio';
        let msg = 'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio';
        if (r.hasPayed) {
          title = 'Eliminación Parcial del Servicio';
          msg = 'Ya existe un historial de pagos realizados con este servicio, sólo se eliminarán las deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
        }
        Swal.fire({
          text: msg,
          title: title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'CONFIRMAR',
          cancelButtonText: 'CANCELAR',
          onOpen: drawPopup
        }).then(r => {
          if (r.value) {
            this.afiliacionService.SendDelService(index)
              .subscribe(r => {
                this.gaService.sendEvent('ServicioEliminado', {
                  'event_category': GoogleAnalytics.Afiliacion,
                  'event_label': 'servicio_eliminado'
                });
                Swal.fire({
                  text: 'Se ha eliminado el Servicio',
                  title: title,
                  onOpen: drawPopup
                });
              });
          }
        });
      });
    }
    else {
      Swal.fire({
        text: 'Se eliminará el servicio de los canales de interbank',
        title: 'Eliminación total el servicio',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
        allowOutsideClick: false,
        onOpen: drawPopup
      }).then(r => {
        if (r.value) {
          this.afiliacionService.DelService(index);
        }
      });
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
    this.serviceActual = svc;
    this.Formulario = true;
  }

  onGrabar(svc: ServiceModel) {
    console.log(svc);
    console.log(this.afiliacionService.services);
    if (this.indiceActual >= 0) {


      if (this.inEdit) {
        if (svc.newNameGtpStatus === 3) {
          if (this.afiliacionService.services.find((s, i) => s.newName.toUpperCase() === svc.newName.toUpperCase() && i !== this.indiceActual)) {
            Swal.fire({
              text: 'Ya existe un servicio con este nombre',
              onOpen: drawPopup
            });
            return;
          }
        } else {
          if (svc.newNameGtpStatus === 0) {
            if (this.afiliacionService.services.find((s, i) => (s.newName.toUpperCase() === svc.newName.toUpperCase()) && i !== this.indiceActual)) {
              Swal.fire({
                text: 'Ya existe un servicio con este nombre',
                onOpen: drawPopup
              });
              return;
            }
          } else {
            if (this.afiliacionService.services.find((s, i) => (s.nombre === null ? s.newName : s.nombre).toUpperCase() === svc.newName.toUpperCase() && i !== this.indiceActual)) {
              Swal.fire({
                text: 'Ya existe un servicio con este nombre',
                onOpen: drawPopup
              });
              return;
            }
          }


        }

      } else {
        if (svc.newNameGtpStatus === 3) {
          if (this.afiliacionService.services.find((s, i) => s.newName.toUpperCase() === svc.newName.toUpperCase() && i !== this.indiceActual)) {
            Swal.fire({
              text: 'Ya existe un servicio con este nombre',
              onOpen: drawPopup
            });
            return;
          }
        } else {
          if (this.afiliacionService.services.find((s, i) => s.nombre.toUpperCase() === svc.nombre.toUpperCase() && i !== this.indiceActual)) {
            Swal.fire({
              text: 'Ya existe un servicio con este nombre',
              onOpen: drawPopup
            });
            return;
          }
        }

      }


      this.afiliacionService.services[this.indiceActual] = svc;
      this.indiceActual = -1;
      if (!svc.id) {
        this.gaService.sendEvent('ServicioAgregado', {
          'event_category': GoogleAnalytics.Afiliacion,
          'event_label': 'servicio_agregado'
        });
      }
    } else {
      let nro = 1;
      this.afiliacionService.services.forEach((s, i) => {
        if (s.nombre.startsWith(svc.nombre)) {
          if (!isNaN(parseInt(s.nombre.substr(svc.nombre.length))) || s.nombre.substr(svc.nombre.length) === '') {
            nro += 1;
          }
        }
      });
      if (nro > 1) {
        svc.nombre += nro.toString();
      }
      this.afiliacionService.services.push(svc);

    }
    this.Formulario = false;
    this.Formulariogtp = false;
    if (this.addNewAfterSave) {
      setTimeout(() => this.MostarFormulario(), 600);
    } else if (this.sendAfterSave) {
      setTimeout(() => this.EnviarServicios(), 600);
    } else {
      Swal.fire({
        title: 'Servicio Guardado',
        text: 'Los datos han sido guardados',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "CERRAR",
        onOpen: drawPopup
      });
    }
    this.addNewAfterSave = false;
    this.sendAfterSave = false;
  }

}
