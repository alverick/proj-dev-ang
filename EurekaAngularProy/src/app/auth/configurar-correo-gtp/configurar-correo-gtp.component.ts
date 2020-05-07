import { CorreoGtpModel } from './../../shared/models/data-correoGtp';
import { drawPopup } from 'src/app/shared/services/popups';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { GtpService } from './../../shared/services/gtp.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configurar-correo-gtp',
  templateUrl: './configurar-correo-gtp.component.html',
  styleUrls: ['./configurar-correo-gtp.component.scss']
})
export class ConfigurarCorreoGtpComponent implements OnInit {
  frmCorreoGtp: FormGroup;
  submittedRequired = false;
  Formulario = false;
  titleCorreo = 'Agregar nuevo correo';
  titlebtn = 'Guardar';
  inEdit = false;
  public _service: CorreoGtpModel;
  // correoGtp: CorreoGtpModel;
  constructor(
    private formBuilder: FormBuilder,
    private gtpService: GtpService,
    private router: Router,

  ) { }
  ngOnInit() {

    // window['_url_loop_'] = 'configurarCorreoGTP';
    this.frmCorreoGtp = this.formBuilder.group({
      correo: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.minLength(10), Validators.maxLength(100)]),
    })
    this.onListarCorreoGTP();
  }
  get f(): any {
    return this.frmCorreoGtp.controls;
  }
  onListarCorreoGTP() {
    // this.gtpService.GetCorreoGtp().subscribe((data) => {
    //   this.correoGtp = data;
    //   console.log('correos correoGtp3 2', this.correoGtp)
    // })
    this.gtpService.GetCorreoGtp();
    console.log('correos correogtp', this.gtpService.correogtp)

  }

  onGrabarCorreo() {
    debugger
    // const svc = this.gtpService.correogtps;
    // let svc: CorreoGtpModel = {};
    let svc = {
      correo: this.frmCorreoGtp.value.correo
    }
    // svc.push({
    //   correo: this.frmCorreoGtp.value.correo
    // })
    console.log('svc', svc)
    // svc = this._service;
    // this._service.correo = this.frmCorreoGtp.value.correo;
    this.submittedRequired = true;
    if (this.frmCorreoGtp.invalid) {
      return;
    }
    if (this.indiceActual >= 0) {
      if (this.inEdit == false) {
        // this.gtpService.PostConfigurarCorreoGtp(this.frmCorreoGtp.value.correo).subscribe((d) => {
        //   if (d.success) {
        //     this.router.navigate(["/configurarServicios"/*, this.registerForm.get('ruc')*/]);
        //   }
        // })
        if (this.frmCorreoGtp.value.correo == null || this.frmCorreoGtp.value.correo == '') {
          Swal.fire({
            text: 'Debe ingresar Email',
            onOpen: drawPopup
          });
          return;
          // } else if (this.gtpService.correogtp.find((s, i) => (s.correo.toUpperCase() === svc.correo.toUpperCase()) && i !== this.indiceActual)) {
        } else if (this.gtpService.correogtp.find((s, i) => (s.correo.toUpperCase() === svc.correo.toUpperCase()) && i !== this.indiceActual)) {

          Swal.fire({
            text: 'Ya existe un Email con este nombre',
            onOpen: drawPopup
          });
          return;
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
          this.gtpService.correogtp[this.indiceActual] = svc;
          this.indiceActual = -1;
        }
      } else if (this.inEdit == true) {
        this.indiceActual = -1;

        if (this.frmCorreoGtp.value.correo == null || this.frmCorreoGtp.value.correo == '') {
          Swal.fire({
            text: 'Debe ingresar Email',
            onOpen: drawPopup
          });
          return;
        }
      }
    } else {

    }




    this.Formulario = false;

    console.log("hollaa")
    // this.onListarCorreoGTP()

  }
  MostarFormulario() {
    this.Formulario = true;
    this.inEdit = false;
    this.titleCorreo = 'Agregar nuevo correo';
    this.titlebtn = 'Guardar';
    this.indiceActual = this.gtpService.correogtp.length;
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
        onOpen: drawPopup
      }).then(r => {
        if (r.value) {
          this.Formulario = false;
          this.frmCorreoGtp = this.formBuilder.group({
            correo: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.minLength(10), Validators.maxLength(100)]),
          })
          this.inEdit = false;
          this.titleCorreo = 'Agregar nuevo correo';
          this.titlebtn = 'Guardar';
          // this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
          // this.Formulario = false;
          // this.stateCreate = false;
          // this.stateEdit = false;
          // this.addNewAfterSave = false;
          // this.sendAfterSave = false;
          // this.indiceActual = -1;
          // this.Formulariogtp = false;
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

  EnviarServicios() {

  }
  public indiceActual: number = -1;
  onEditar(data, index: number) {
    debugger
    this.titleCorreo = 'Actualizar correo';
    this.titlebtn = 'Actualizar';
    this.inEdit = true;
    this.Formulario = true;
    this.indiceActual = index;
    this.frmCorreoGtp = this.formBuilder.group({
      correo: new FormControl({ value: data.correo, disabled: false }, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.minLength(10), Validators.maxLength(100)]),
    })
  }
  onEliminar(data, index: number) {

  }
}
