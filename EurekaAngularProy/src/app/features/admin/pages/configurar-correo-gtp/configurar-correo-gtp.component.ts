import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { CorreoGtpModel } from '../../../../shared/models/data-correoGtp';
import { GtpService } from '../../../../shared/services/gtp.service';

@Component({
  selector: 'cs-configurar-correo-gtp',
  templateUrl: './configurar-correo-gtp.component.html',
  styleUrls: ['./configurar-correo-gtp.component.scss'],
})
export class ConfigurarCorreoGtpComponent implements OnInit {
  frmCorreoGtp: UntypedFormGroup;
  Formulario = false;
  titleCorreo = 'Agregar E-mail';
  titlebtn = 'Agregar';
  summited = false;
  public _service: CorreoGtpModel;
  public correos: CorreoGtpModel[] = [];
  public indiceActual = -1;

  // correoGtp: CorreoGtpModel;
  constructor(
    private formBuilder: UntypedFormBuilder,
    public gtpService: GtpService
  ) {}

  ngOnInit() {
    this.frmCorreoGtp = this.formBuilder.group({
      correo: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
    });
    this.onListarCorreoGTP();
  }
  get f(): any {
    return this.frmCorreoGtp.controls;
  }

  onListarCorreoGTP() {
    this.gtpService.GetCorreoGtp().subscribe((r) => (this.correos = r));
  }

  onGrabarCorreo() {
    if (this.correos.length === 0) {
      Swal.fire({
        text: 'Debe ingresar al menos 1 e-mail',
        onOpen: drawPopup,
      });
      return;
    }
    this.gtpService.PostConfigurarCorreoGtp(this.correos).subscribe((r) => {
      Swal.fire({
        title: 'Grabar',
        text: 'Los emails han sido guardados',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        onOpen: drawPopup,
      });
    });
  }

  onEditar(data, index: number) {
    this.titleCorreo = 'Actualizar E-mail';
    this.titlebtn = 'Actualizar';
    this.Formulario = true;
    this.summited = false;
    this.indiceActual = index;
    this.frmCorreoGtp.setValue({ correo: data.correo });
  }

  onEliminar(index: number) {
    Swal.fire({
      text: 'Se va a eliminar el e-mail.',
      title: 'Eliminar',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      onOpen: drawPopup,
    }).then((r) => {
      if (r.value) {
        this.correos.splice(index, 1);
      }
    });
  }

  onAgregar() {
    this.Formulario = true;
    this.frmCorreoGtp.setValue({ correo: '' });
    this.summited = false;
    this.titleCorreo = 'Agregar E-mail';
    this.titlebtn = 'Agregar';
  }

  getCorreoError() {
    if (this.f.correo.invalid) {
      if (this.f.correo.hasError('minlength')) {
        return 'El e-mail debe tener al menos 10 carácteres';
      }
      if (this.f.correo.hasError('pattern')) {
        return 'Ingrese un e-mail válido';
      }
    }
    return '';
  }

  onGrabar() {
    this.summited = true;
    if (this.frmCorreoGtp.valid) {
      if (this.indiceActual >= 0) {
        if (
          this.correos.find(
            (s, i) =>
              s.correo.toUpperCase() ===
                this.frmCorreoGtp.value.correo.toUpperCase() &&
              i !== this.indiceActual
          )
        ) {
          Swal.fire({
            text: 'Ya existe un E-mail con este nombre',
            onOpen: drawPopup,
          });
          return;
        } else {
          this.correos[this.indiceActual].correo =
            this.frmCorreoGtp.value.correo;
        }
      } else {
        if (
          this.correos.find(
            (s, i) =>
              s.correo.toUpperCase() ===
                this.frmCorreoGtp.value.correo.toUpperCase() &&
              i !== this.indiceActual
          )
        ) {
          Swal.fire({
            text: 'Ya existe un E-mail con este nombre',
            onOpen: drawPopup,
          });
          return;
        } else {
          this.correos.push({ correo: this.frmCorreoGtp.value.correo });
        }
      }
      this.indiceActual = -1;
      this.Formulario = false;
    }
  }
}
