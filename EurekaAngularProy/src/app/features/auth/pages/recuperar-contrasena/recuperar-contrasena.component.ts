import { Component, HostListener, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forEachObjIndexed } from 'ramda';
import { authFullRoutingNames } from 'src/app/app-routing.collection';
import { RecuperaService } from 'src/app/shared/services/recupera.service';
import { swalAlert } from 'src/app/shared/utils/helpers/popups';

import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
  Metadata,
} from '../../../../shared/services/adobe-analytics.service';

@Component({
  selector: 'cs-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
})
export class RecuperarContrasenaComponent implements OnInit {
  constructor(
    private formBuilder: UntypedFormBuilder,
    private recuperaService: RecuperaService,
    private router: Router,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {}
  public formulario = true;
  recupera: UntypedFormGroup;
  public submitted = false;
  submittedRequired = false;

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
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
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
    });
  }

  get f(): any {
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
            this.adobeAnalytics.trackEvent(
              AdobeEvent.trackFormSubmit,
              actionStep
            );
            this.mensaje(
              'Hemos recibido tus datos',
              'Estamos revisando los datos que ingresaste, en caso de que sean correctos recibirás un correo electrónico con indicaciones para acceder a tu cuenta.'
            );
            this.formulario = false;
            this.f.ruc.reset();
            this.f.ruc.clearValidators();
            this.f.email.reset();
            this.f.email.clearValidators();
            // al ocultar la pantalla se mostrara en la parte de arriba la pagina
            this.router.navigate([authFullRoutingNames.LOGIN]);
          } else {
            this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
              ...actionStep,
              state: 'Intención de envío',
              typeError: 'Los datos ingresados son inválidos',
            });
            this.mensaje(
              'Los datos ingresados son inválidos',
              'Por favor, verifique e ingréselos nuevamente.'
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
            'Se ha reenviado un correo electrónico con indicaciones para acceder a tu cuenta.'
          );
          this.formulario = false;
        } else {
          this.mensaje(
            'Los datos ingresados son inválidos',
            'Por favor, verifique e ingréselos nuevamente.'
          );
        }
      });
  }

  mensaje(titulo: string, text: string) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: titulo,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
    void swalAlert.fire({
      // type: tipo ,
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
