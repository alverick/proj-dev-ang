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
  constructor(private afiliacionService: AfiliacionService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.Formulario =true;
    this.afiliacionService.services = []
  //  console.log(this.route.params.subscribe( params => this.ruc = params.ruc )) ;
    this.route.data.subscribe(d => {
      console.log('Configurar Servicios');
      console.log(d);
      if (d.isEdit) {
        console.log('pide token xdee -----------------');
        this.afiliacionService.GetServicios();
      } else {
        // siempre entra ahí
        console.log('llamando a Clear');
        this.afiliacionService.Clear();
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
        this.router.navigate(['/procesando']);
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
    Swal.fire({
      type: 'warning',
      text: 'Se va a eliminar el registro. ¿Desea continuar?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si, eliminalo!',
      allowOutsideClick: false
    }).then(r => {
      if (r.value) {
        this.afiliacionService.DelService(index);
      }
    });
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
