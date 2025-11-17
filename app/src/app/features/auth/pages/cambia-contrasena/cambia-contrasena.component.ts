
import { Component, type OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';

import { ControlRulesPoliciesComponent } from '../../../../shared/components/control-rules-policies/control-rules-policies.component';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import { type ModelFormGroup } from '../../../../shared/models/forms';
import { RecuperaService } from '../../../../shared/services/recupera.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { MustMatch } from '../../../../shared/validators/must-match.validator';
import {
  messageErrorNewPasswords,
  passwordValidators,
} from '../../../../shared/validators/password-validators';
import { authFullRoutingNames } from '../../auth-routing.names';
import { LayoutFormComponent } from '../../components/layout-form/layout-form.component';

export type FormChangePassword = {
  contrasena: string;
  repcontrasena: string;
};

@Component({
    selector: 'cs-cambia-contrasena',
    templateUrl: './cambia-contrasena.component.html',
    standalone: true,
    imports: [
    LayoutFormComponent,
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    PasswordModule,
    PrimeTemplate,
    ControlRulesPoliciesComponent,
    ButtonDirective,
    Ripple
]
})
export class CambiaContrasenaComponent implements OnInit {
  public llave: string;
  public formulario: boolean;
  protected readonly messageErrorNewPasswords = messageErrorNewPasswords;
  errorMessages = errorRegisterAuth;
  public Cambia: ModelFormGroup<FormChangePassword>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly rutaActiva: ActivatedRoute,
    private readonly router: Router,
    private readonly recuperaService: RecuperaService,
    public storage: StorageService,
    protected tracking: TrackingService,
  ) {}
  ngOnInit() {
    this.Cambia = this.formBuilder.group(
      {
        contrasena: ['', passwordValidators],
        repcontrasena: ['', passwordValidators],
      },
      {
        validators: MustMatch('contrasena', 'repcontrasena'),
      },
    );
    this.llave = this.rutaActiva?.snapshot?.params.llave as string;
    this.Verificar(this.llave);
  }

  Verificar(key: string) {
    this.recuperaService
      ?.VerifingToken({ TokenEncrypted: key })
      ?.subscribe((d) => {
        if (d !== true) {
          this.mensaje(
            'Enlace expirado',
            'El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro para recuperar tu contraseña',
          );
          void this.router.navigate([authFullRoutingNames.LOGIN]);
        }
      });
  }

  SubmitCambia() {
    if (this.Cambia.valid) {
      const actionStep: Partial<ActionEventProperties> = {
        category: 'Cambio contraseña',
        action: 'Click',
        label: 'Guardar',
        location: 'Cambio contraseña',
        step: 'Not available',
        state: 'Envío exitoso',
      };

      this.recuperaService
        .ChangePassword({
          NewPassword: this.Cambia.value.contrasena,
          Token: this.llave,
        })
        ?.subscribe((d) => {
          if (!d) {
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
              ...actionStep,
              state: 'Intención de envío',
              typeError: 'Error al actualizar contraseña',
            });
            this.mensaje(
              'Actualizar Contraseña',
              'Error al actualizar contraseña',
            );
          } else if (d) {
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
            this.PopUpWithOneButon(
              'Contraseña actualizada',
              'Tu contraseña ha sido actualizada.',
              'Iniciar sesión',
            );
          }
        });
    }
  }

  mensaje(titulo: string, text: string) {
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: titulo,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
    void swalAlert.fire({
      title: titulo,
      html: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Entiendo',
    });
  }

  PopUpWithOneButon(titulo: string, text: string, firstButton: string) {
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: titulo,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
    void swalAlert
      .fire({
        title: titulo,
        html: text,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: firstButton,
      })
      .then(() => {
        void this.router.navigate([authFullRoutingNames.LOGIN]);
      });
  }
}
