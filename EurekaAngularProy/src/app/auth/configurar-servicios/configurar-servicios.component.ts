import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormServicioComponent } from '../form-servicio/form-servicio.component';

@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss']
})
export class ConfigurarServiciosComponent implements OnInit {

  protected ruc: number;
  public stateCreate: boolean;
  public stateEdit: boolean;
  public input: FormServicioComponent;
  Formulario: boolean = false;
  buttonServicios ='';
  private inEdit: boolean = false;

  public onFormAction: EventEmitter<string> = new EventEmitter();

  constructor(public afiliacionService: AfiliacionService, private route: ActivatedRoute,
    private router: Router) { }

    @HostListener('window:beforeunload', ['$event'])
    public closeWindow($event: any) {
      if (!this.afiliacionService.Guardado) {
        $event.returnValue = 'Se van a perder los cambios.';
      }
    }

  ngOnInit() {
    this.afiliacionService.services = []
  //  console.log(this.route.params.subscribe( params => this.ruc = params.ruc )) ;
    this.route.data.subscribe(d => {
      console.log('Configurar Servicios');
      console.log(d);
      this.inEdit = d.isEdit;
      if (d.isEdit) {
        console.log('pide token xdee -----------------');
        this.afiliacionService.GetServicios();
        this.buttonServicios = 'Actualizar';
      } else {
        // siempre entra ahí
        window['_url_loop_'] = 'configurarServicios';
        history.pushState(null, null, 'configurarServicios');
        console.log('llamando a Clear');
        this.afiliacionService.Clear();
        this.buttonServicios = 'Guardar';
        this.editService(this.afiliacionService.services[0], 0);
      }
    });
  }

  public indiceActual: number = -1;
  serviceActual: ServiceModel = null;

  OcultarFormulario(requireConfirm: boolean) {
    if (requireConfirm) {
      Swal.fire({
        type: 'question',
        title: 'Descartar Cambios',
        text: 'Se van a descartar los cambios.',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Descartar',
        cancelButtonText: 'Regresar'
      }).then(r => {
        if (r.value) {
          this.Formulario = false
          this.stateCreate =false;
          this.stateEdit =false;
          this.addNewAfterSave = false;
          this.sendAfterSave = false;
          this.afiliacionService.Descartar(this.indiceActual);
          this.indiceActual = -1;
        }
      });
    }
    else {
      this.Formulario = false
      this.stateCreate =false;
      this.stateEdit =false;
      this.afiliacionService.Descartar(this.indiceActual);
      this.indiceActual = -1;
      if (this.addNewAfterSave) {
        setTimeout(() => this.MostarFormulario(), 600);
      }
      else if (this.sendAfterSave) {
        setTimeout(() => this.EnviarServicios(), 600);
      }
      this.addNewAfterSave = false;
      this.sendAfterSave = false;
    }
  }

  addNewAfterSave: boolean = false;
  sendAfterSave: boolean = false;

  MostarFormulario() {
    console.log(this.afiliacionService.services.length);
    if(this.afiliacionService.services.length >= 99){
      Swal.fire({
        type: 'error',
        text: 'Usted solo puede tener 99 servicios como máximo',
        allowOutsideClick: false
      });
      return;
    }
    if (this.Formulario) {
      Swal.fire({
        type: 'warning',
        title: 'Servicio no guardado',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Deshacer cambios',
        cancelButtonColor: '#d33'
      }).then(r => {
        console.log(r);
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
      this.Formulario = true;
    }
  }



  EnviarServicios() {
 //   if(this.afiliacionService.services.forEach)


    if(this.Formulario === true){
      Swal.fire({
        title: 'Servicio no guardado',
        type: 'warning',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText:  'Deshacer cambios',
        confirmButtonText: 'Guardar',
        allowOutsideClick: false
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
        type: 'error',
        text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
        allowOutsideClick: false
      });
      return;
    }
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
      Swal.fire({
        type: 'warning',
        title: 'Eliminación del Servicio',
        text: 'Actualmente esta editando un servicio. Debe guardar o descartar los cambios',
        showCloseButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar'
      });
      return;
    }
    if (this.inEdit) {
      this.afiliacionService.CanDeleteService(index).subscribe(r => {
        let title = 'Eliminación total el servicio';
        let msg = 'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio';
        if (r.hasPayed) {
          title = 'Eliminacion Parcial del Servicio';
          msg = 'Ya existe un historial de pagos realizados con este servicio, solo se eliminarán las deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
        }
        Swal.fire({
          type: 'warning',
          text: msg,
          title: title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false
        }).then(r => {
          if (r.value) {
            this.afiliacionService.SendDelService(index)
              .subscribe(r => {
                Swal.fire({
                  type: 'info',
                  text: 'Se ha eliminado el Servicio',
                  title: title,
                  allowOutsideClick: false
                });
              });
          }
        });
      });
    }
    else {
      Swal.fire({
        type: 'warning',
        text: 'Se eliminará el servicio de los canales de interbank',
        title: 'Eliminación total el servicio',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
      }).then(r => {
        if (r.value) {
          this.afiliacionService.DelService(index);
        }
      });
    }
  }

  editService(svc: ServiceModel, index: number) {
    if (this.Formulario && this.indiceActual !== index) {
      Swal.fire({
        type: 'warning',
        title: 'Edición del Servicio',
        text: 'Actualmente esta editando un servicio. Debe guardar o descartar los cambios',
        showCloseButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar'
      });
      return;
    }

    this.stateEdit = true;
    console.log(index);
    this.indiceActual = index;
   /* if(svc.codDeudor !== 'DNI' && svc.codDeudor !== 'RUC' && svc.codDeudor !== 'Codigo Interno' && svc.codDeudor !== 'Otro Codigo' ){
      console.log('cambios '+ svc.codDeudor);
    } */
    this.serviceActual = svc;
    this.Formulario = true;
  }

  onGrabar(svc: ServiceModel) {
    if (this.indiceActual >= 0) {
      if (this.afiliacionService.services.find((s, i) => s.nombre.toUpperCase() === svc.nombre.toUpperCase() && i !== this.indiceActual)) {
        Swal.fire({
          type: 'error',
          text: 'Ya existe un servicio con este nombre',
          allowOutsideClick: false
        });
        return;
      }
      this.afiliacionService.services[this.indiceActual] = svc;
      this.indiceActual = -1;
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
        type: 'info',
        title: 'Guardar',
        text: 'Los datos han sido guardados',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Cerrar"
      });
    }
    this.addNewAfterSave = false;
    this.sendAfterSave = false;
  }

}
