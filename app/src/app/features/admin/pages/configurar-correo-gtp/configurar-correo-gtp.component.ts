import { DatePipe, CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { clone, equals } from 'ramda';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { emailRegex } from '../../../../shared/constants/patterns';
import { type CorreoGtpModel } from '../../../../shared/models/data-correoGtp';
import { GtpService } from '../../../../shared/services/gtp.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';

@Component({
    selector: 'cs-configurar-correo-gtp',
    templateUrl: './configurar-correo-gtp.component.html',
    styleUrls: ['./configurar-correo-gtp.component.scss'],
    providers: [GtpService, DatePipe],
    standalone: true,
    imports: [
        CommonModule,
        ButtonDirective,
        Ripple,
        FormsModule,
        ReactiveFormsModule,
        LabelControlComponent,
        InputTextModule,
    ]
})
export class ConfigurarCorreoGtpComponent implements OnInit {
  frmCorreoGtp = this.formBuilder.group({
    correo: [
      '',
      [
        Validators.required,
        Validators.pattern(emailRegex),
        Validators.minLength(10),
        Validators.maxLength(50),
      ],
    ],
  });
  Formulario = false;
  showButton = false;
  titleCorreo = 'Agregar E-mail';
  titlebtn = 'Agregar';
  summited = false;
  public _service: CorreoGtpModel;
  public correos: CorreoGtpModel[] = [];
  public emailOriginal: CorreoGtpModel[] = [];
  public indiceActual = -1;
  errorsForm = {
    correo: {
      minLength: 'El e-mail debe tener al menos 10 carácteres',
      required: 'Ingrese un e-mail válido',
      pattern: 'Ingrese un e-mail válido',
    },
  };

  // correoGtp: CorreoGtpModel;
  constructor(
    private readonly formBuilder: FormBuilder,
    public gtpService: GtpService,
  ) {}

  ngOnInit() {
    this.onListarCorreoGTP();
  }
  get f(): any {
    return this.frmCorreoGtp.controls;
  }

  onListarCorreoGTP() {
    this.gtpService.GetCorreoGtp().subscribe((r) => {
      this.emailOriginal = clone(r);
      this.correos = r;
    });
  }

  onGrabarCorreo() {
    if (this.correos.length === 0) {
      swalAlert.fire({
        text: 'Debe ingresar al menos 1 e-mail',
      });
      return;
    }
    this.gtpService.PostConfigurarCorreoGtp(this.correos).subscribe((r) => {
      this.emailOriginal = clone(this.correos);
      this.checkListEmails();
      swalAlert.fire({
        title: 'Grabar',
        text: 'Los emails han sido guardados',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
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
    swalAlert
      .fire({
        text: 'Se va a eliminar el e-mail.',
        title: 'Eliminar',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
      .then((r) => {
        if (r.value) {
          this.correos.splice(index, 1);
          this.checkListEmails();
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

  onGrabar() {
    this.summited = true;
    if (!this.frmCorreoGtp.valid) return;

    const correoValue = this.frmCorreoGtp.value.correo?.toUpperCase();

    if (this.isDuplicateCorreo(correoValue, this.indiceActual)) {
      swalAlert.fire({
        text: 'Ya existe un E-mail con este nombre',
      });
      return;
    }

    if (this.indiceActual >= 0) {
      this.correos[this.indiceActual].correo = this.frmCorreoGtp.value.correo;
    } else {
      this.correos.push({ correo: this.frmCorreoGtp.value.correo });
    }

    this.checkListEmails();
    this.indiceActual = -1;
    this.Formulario = false;
  }

  private checkListEmails() {
    this.showButton = !equals(this.emailOriginal, this.correos);
  }

  private isDuplicateCorreo(correo: string, excludeIndex: number) {
    return this.correos.some(
      (s, i) => s.correo.toUpperCase() === correo && i !== excludeIndex,
    );
  }
}
