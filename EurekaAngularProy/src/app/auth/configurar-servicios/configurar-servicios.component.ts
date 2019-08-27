import { Component, OnInit } from '@angular/core';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormServicioComponent } from '../form-servicio/form-servicio.component';
import { throwError } from 'rxjs';

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
  Formulario: boolean =true;
  buttonServicios ='';
  private inEdit: boolean = false;

  constructor(public afiliacionService: AfiliacionService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.afiliacionService.services = []
  //  console.log(this.route.params.subscribe( params => this.ruc = params.ruc )) ;
    this.route.data.subscribe(d => {
      console.log('Configurar Servicios');
      console.log(d);
      this.inEdit = d.isEdit;
      if (d.isEdit) {
        console.log('pide token xdee -----------------');
        this.Formulario = false;
        this.afiliacionService.GetServicios();
        this.buttonServicios = 'Actualizar';
      } else {
        // siempre entra ahí
        window['_url_loop_'] = 'configurarServicios';
        console.log('llamando a Clear');
        this.Formulario =true;
        this.afiliacionService.Clear();
        this.buttonServicios = 'Guardar';
        this.editService(this.afiliacionService.services[0], 0);
      }
    });
  }

  private indiceActual: number = -1;
  serviceActual: ServiceModel = null;

  OcultarFormulario() {
    this.Formulario = false
    this.stateCreate =false;
    this.stateEdit =false;
  }
  MostarFormulario() {
    this.stateCreate == true;
    this.indiceActual = -1;
    this.serviceActual = null;
    this.Formulario = true;
  }



  EnviarServicios() {
 //   if(this.afiliacionService.services.forEach)


    if(this.Formulario === true){
      Swal.fire({
        title: 'Servicio no guardado',
        type: 'error',
        text: 'Guarde los cambios del servicio  para poder continuar al siguiente paso',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText:  'Cerrar',
        allowOutsideClick: false
      });
      return;
    }
    // this.frm.get('monto').value

    if(this.afiliacionService.services.length > 99){
      Swal.fire({
        type: 'error',
        text: 'solo puede tener 99 servicios como maximo',
        allowOutsideClick: false
      });
      return;
    }
    if(this.afiliacionService.services.find((v) => v.nroCuenta === '')) {
      Swal.fire({
        type: 'error',
        text: 'Falta Ingresar datos en su servicio Pension',
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

    console.log(svc);
    if (this.indiceActual >= 0) {
      if (this.afiliacionService.services.find((s, i) => s.nombre === svc.nombre && i !== this.indiceActual)) {
        Swal.fire({
          type: 'error',
          text: 'Ya existe un servicio con este nombre',
          allowOutsideClick: false
        });
        return;
      }
      this.afiliacionService.services[this.indiceActual] = svc;
    }
    else {
      if (this.afiliacionService.services.find(s => s.nombre === svc.nombre)) {
        Swal.fire({
          type: 'error',
          text: 'Ya existe un servicio con este nombre',
          allowOutsideClick: false
        });
        return;
      }
      this.afiliacionService.services.push(svc);
    }
    this.Formulario = false;
  }

}
