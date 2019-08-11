import { Component, OnInit } from '@angular/core';
import { ServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss']
})
export class ConfigurarServiciosComponent implements OnInit {

  Formulario: boolean =true;
  constructor(private afiliacionService: AfiliacionService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.Formulario =true;
    this.route.data.subscribe(d => {
      console.log('Configurar Servicios');
      console.log(d);
      if (d.isEdit) {
        this.afiliacionService.GetServicios();
      } else {
        console.log('llamando a Clear');
        this.afiliacionService.Clear();
      }
    })
  }

  private indiceActual: number = -1;
  serviceActual: ServiceModel = null;

  OcultarFormulario(){
    this.Formulario = false 
  }
  MostarFormulario() {
    this.indiceActual = -1;
    this.serviceActual = null;
    this.Formulario = true;
  }

  EnviarServicios() {
    this.afiliacionService.GrabarServicios()
      .subscribe(r => { });
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

  delService(index: number) {
    Swal.fire({
      type: 'warning',
      text: 'Se va a eliminar el registro. ¿Desea continuar?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si, eliminalo!'
    }).then(r => {
      if (r.value) {
        this.afiliacionService.DelService(index);
      }
    });
  }

  editService(svc: ServiceModel, index: number) {
    console.log(index);
    this.indiceActual = index;
    this.serviceActual = svc;
    this.Formulario = true;
  }

  onGrabar(svc: ServiceModel) {
    console.log(svc);
    if (this.indiceActual >= 0) {
      if (this.afiliacionService.services.find((s, i) => s.nombre === svc.nombre && i !== this.indiceActual)) {
        Swal.fire({
          type: 'error',
          text: 'Ya existe un servicio con este nombre'
        });
        return;
      }
      this.afiliacionService.services[this.indiceActual] = svc;
    }
    else {
      if (this.afiliacionService.services.find(s => s.nombre === svc.nombre)) {
        Swal.fire({
          type: 'error',
          text: 'Ya existe un servicio con este nombre'
        });
        return;
      }
      this.afiliacionService.services.push(svc);
    }
    this.Formulario = false;
  }

  
}


