import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormServicioComponent } from '../form-servicio/form-servicio.component';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';

@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss']
})
export class ConfigurarServiciosComponent implements OnInit {

  protected ruc: number;
  public stateCreate: boolean = false;
  public stateEdit: boolean = false;
  public input: FormServicioComponent;
  Formulario: boolean = false;
  buttonServicios ='';
  private inEdit: boolean = false;
  public titulo: string;
  public onFormAction: EventEmitter<string> = new EventEmitter();

  constructor(public afiliacionService: AfiliacionService, private route: ActivatedRoute,
    private router: Router, private gaService: GoogleAnalytics) { }

    @HostListener('window:beforeunload', ['$event'])
    public closeWindow($event: any) {
      if (!this.afiliacionService.Guardado) {
        $event.returnValue = 'Se van a perder los cambios.';
      }
    }

  ngOnInit() {
    this.afiliacionService.services = []
    this.route.data.subscribe(d => {
      this.inEdit = d.isEdit;
      if (d.isEdit) {
        this.afiliacionService.GetServicios();
        this.buttonServicios = 'Actualizar';
        this.titulo = 'Edita el servicio';
      } else {
        // siempre entra ahí
        window['_url_loop_'] = 'configurarServicios';
        history.pushState(null, null, 'configurarServicios');
        this.afiliacionService.Clear();
        this.buttonServicios = 'Guardar';
        this.editService(this.afiliacionService.services[0], 0);
        this.titulo = 'Agrega un nuevo servicio';
      }
    });

  }

  public indiceActual: number = -1;
  serviceActual: ServiceModel = null;

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
          this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
          this.Formulario = false ;
          this.stateCreate = false;
          this.stateEdit = false;
          this.addNewAfterSave = false;
          this.sendAfterSave = false;
          this.indiceActual = -1;
          console.log(this.Formulario);
        }
      });
    }
   /* else {
      console.log('entra else');
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
    if(this.afiliacionService.services.length >= 99){
      Swal.fire({
        text: 'Usted solo puede tener 99 servicios como máximo',
        onOpen: drawPopup
      });
      return;
    }

    let svcSinCta = this.afiliacionService.services.find((v) => v.nroCuenta === '');
    if(svcSinCta) {
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
 //   if(this.afiliacionService.services.forEach)


    if(this.Formulario === true){
      Swal.fire({
        title: 'Servicio no guardado',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText:  'DESHACER CAMBIOS',
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
    if(svcSinCta) {
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

  getCodDebtor(svc: ServiceModel) {
    if (svc.codDeudor === 'Otro')
      return svc.nameCod;
    return svc.codDeudor;
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
          title = 'Eliminacion Parcial del Servicio';
          msg = 'Ya existe un historial de pagos realizados con este servicio, solo se eliminarán las deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
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
    this.stateEdit = true;
    this.stateCreate = false;
    this.indiceActual = index;
    this.serviceActual = svc;
    this.Formulario = true;
  }

  onGrabar(svc: ServiceModel) {
    if (this.indiceActual >= 0) {
      if (this.afiliacionService.services.find((s, i) => s.nombre.toUpperCase() === svc.nombre.toUpperCase() && i !== this.indiceActual)) {
        Swal.fire({
          text: 'Ya existe un servicio con este nombre',
          onOpen: drawPopup
        });
        return;
      }
      this.afiliacionService.services[this.indiceActual] = svc;
      this.indiceActual = -1;
      if (!svc.id) {
        this.gaService.sendEvent('ServicioAgregado', {
          'event_category': GoogleAnalytics.Afiliacion,
          'event_label': 'servicio_agregado'
        });
      }
    }
    else {
      let nro = 1;
      this.afiliacionService.services.forEach((s, i) => {
        if (s.nombre.startsWith(svc.nombre)) {
          if (!isNaN(parseInt(s.nombre.substr(svc.nombre.length))) || s.nombre.substr(svc.nombre.length) === ''){
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
    if (this.addNewAfterSave) {
      setTimeout(() => this.MostarFormulario(), 600);
    }
    else if (this.sendAfterSave) {
      setTimeout(() => this.EnviarServicios(), 600);
    }
    else {
      Swal.fire({
        title: 'Guardar',
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
