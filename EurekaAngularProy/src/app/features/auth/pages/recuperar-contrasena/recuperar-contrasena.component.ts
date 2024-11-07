import { Component, HostListener, type OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Ripple } from 'primeng/ripple';
import { forEachObjIndexed } from 'ramda';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { errorsLoginForm } from '../../../../shared/constants/company-errors';
import { emailRegex } from '../../../../shared/constants/patterns';
import { RecuperaService } from '../../../../shared/services/recupera.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  type Metadata,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../../auth-routing.names';
import { LayoutFormComponent } from '../../components/layout-form/layout-form.component';

@Component({
  selector: 'cs-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  standalone: true,
  imports: [
    LayoutFormComponent,
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    KeyFilterModule,
    ButtonDirective,
    Ripple,
  ],
})
export class RecuperarContrasenaComponent implements OnInit {
  public formulario = true;
  recupera: UntypedFormGroup;
  public submitted = false;
  submittedRequired = false;
  protected readonly errorMessages = errorsLoginForm;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private recuperaService: RecuperaService,
    private router: Router,
    protected tracking: TrackingService,
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: BeforeUnloadEvent) {
    if (!this.formulario) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.recupera = this.formBuilder.group({
      ruc: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[1-2]0[0-9]+?'),
        Validators.minLength(11),
      ]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(emailRegex),
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
    });
  }

  get f() {
    return this.recupera.controls;
  }

  SubmitRecupera() {
    this.submittedRequired = true;
    if (this.recupera.valid) {
      const metadata: Metadata[] = [];
      forEachObjIndexed((value, key) => {
        metadata.push({
          key: key as string,
          value: value as string,
        });
      }, this.recupera.value);
      const actionStep: Partial<ActionEventProperties> = {
        category: 'Recuperar contraseña',
        action: 'Click',
        label: 'Enviar',
        location: 'Recuperar contraseña',
        step: 'Not available',
        state: 'Envío exitoso',
        metadata,
      };

      this.recuperaService
        .RecoverPassword({
          RUC: this.recupera.value.ruc,
          Email: this.recupera.value.email,
        })
        .subscribe((d) => {
          if (d === true) {
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
            this.mensaje(
              'Hemos recibido tus datos',
              'Estamos revisando los datos que ingresaste, en caso de que sean correctos recibirás un correo electrónico con indicaciones para acceder a tu cuenta.',
            );
            this.formulario = false;
            this.f.ruc.reset();
            this.f.ruc.clearValidators();
            this.f.email.reset();
            this.f.email.clearValidators();
            // al ocultar la pantalla se mostrara en la parte de arriba la pagina
            void this.router.navigate([authFullRoutingNames.LOGIN]);
          } else {
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
              ...actionStep,
              state: 'Intención de envío',
              typeError: 'Los datos ingresados son inválidos',
            });
            this.mensaje(
              'Los datos ingresados son inválidos',
              'Por favor, verifique e ingréselos nuevamente.',
            );
          }
        });
    }
  }

  Reenviar() {
    this.recuperaService
      .RecoverPassword({
        RUC: this.recuperaService.ruc,
        Email: this.recuperaService.email,
      })
      .subscribe((d) => {
        if (d === true) {
          this.mensaje(
            'Hemos recibido tus datos',
            'Se ha reenviado un correo electrónico con indicaciones para acceder a tu cuenta.',
          );
          this.formulario = false;
        } else {
          this.mensaje(
            'Los datos ingresados son inválidos',
            'Por favor, verifique e ingréselos nuevamente.',
          );
        }
      });
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
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
    });
  }
}
