import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, type OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { type Password, PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { internalFullRoutingNames } from '../../../../app-routing.collection';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { errorsLoginForm } from '../../../../shared/constants/company-errors';
import { AFFILIATION_SUSPENDED } from '../../../../shared/constants/message-service';
import { loginResultStatus } from '../../../../shared/constants/session';
import { ModelFormGroup } from '../../../../shared/models/forms';
import { LoginService } from '../../../../shared/services/login.service';
import { RecaptchaProviderService } from '../../../../shared/services/recaptcha-provider.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { rucValidators } from '../../../../shared/validators/company-validators';
import { appConfigFeature } from '../../../../store/reducers/app-config.reducer';
import { authFullRoutingNames } from '../../auth-routing.names';
import { LayoutFormComponent } from '../../components/layout-form/layout-form.component';

const userData = environment.credentials[0];

interface LoginForm {
  ruc: string;
  psw: string;
  rememberMe: boolean;
}

@Component({
  selector: 'cs-login',
  templateUrl: './login.page.html',
  providers: [MessageService, RecaptchaProviderService],
  standalone: true,
  imports: [
    LayoutFormComponent,
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    KeyFilterModule,
    CheckboxModule,
    PasswordModule,
    RouterLink,
    ButtonDirective,
    Ripple,
    LetDirective,
    ToastModule,
  ],
})
export class LoginPage implements OnInit {
  public loginForm: ModelFormGroup<LoginForm>;
  public rememberMe = false;

  intentos: number;
  intentosRestantes = 6;
  codRespuesta: number;
  intento6 = false;
  @ViewChild('passwordControl') passwordControl: Password;
  protected readonly errorMessages = errorsLoginForm;

  linkRecoverPassword = authFullRoutingNames.RECOVER_PASSWORD;
  disabledAffiliation$ = this.store.select(
    appConfigFeature.selectDisabledAffiliation,
  );
  attemptsLimit = 6;
  recaptcha = inject(RecaptchaProviderService);
  token = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly storageService: StorageService,
    private readonly tracking: TrackingService,
    private readonly store: Store,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit() {
    const rucStr = this.cookieService.check('ruc')
      ? this.cookieService.get('ruc')
      : userData[0];

    this.validationLogin(rucStr);
  }

  validationLogin(rucStr: string) {
    if (rucStr) {
      this.rememberMe = true;
    }

    this.loginForm = this.formBuilder.group({
      ruc: [rucStr, rucValidators],
      psw: [userData[1], [Validators.required, Validators.maxLength(25)]],
      rememberMe: [this.rememberMe, Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  showModal(title: string, text: string, confirmText = '') {
    void swalAlert.fire({
      title,
      text,
      showCloseButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      confirmButtonText: confirmText || 'Cerrar',
    });

    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: title,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
  }

  public async submitLogin() {
    if (!this.loginForm.valid) {
      return;
    }

    try {
      this.token = await this.recaptcha.getToken('submit_form');
      console.log('reCAPTCHA token:', this.token);

      // Send token to your backend for verification
    } catch (err) {
      console.error('reCAPTCHA failed', err);
    }

    this.cookieService.delete('ruc');

    const actionParams = {
      category: 'Login',
      action: 'Click',
      label: 'Ingresar',
      state: 'Envío exitoso',
      metadata: [
        {
          key: 'TipoDocumento',
          value: 'RUC',
        },
        {
          key: 'NumeroDocumento',
          value: this.f.ruc.value,
        },
        {
          key: 'MostrarPassword',
          value: this.passwordControl.unmasked,
        },
      ],
    };

    this.tracking.setRuc(this.f.ruc.value);

    if (this.loginForm.valid) {
      this.loginService
        .login(this.f.ruc.value, this.f.psw.value, this.token)
        .pipe(first())
        .subscribe({
          next: (value) => {
            this.storageService.setIntentos(value.paramNum);
            this.intentos = value.paramNum;

            this.intentosRestantes = this.attemptsLimit - this.intentos;
            this.codRespuesta = value.codRespuesta;
            if (value.paramStr === 'Un session ya se encuentra activa') {
              this.showModal('Existe una Sesión Activa', '');
              this.sendAdobeTrack({
                ...actionParams,
                state: 'Intención de envío',
                typeError: value.paramStr,
              });
            } else if (
              value.estado === true &&
              this.intentos <= this.attemptsLimit
            ) {
              if (this.f.rememberMe.value === true) {
                const expire = new Date();
                expire.setDate(expire.getDate() + 25);
                this.cookieService.set('ruc', this.f.ruc.value, expire);
              }

              window.sessionStorage.setItem('username', this.f.ruc.value);
              void this.router.navigate([internalFullRoutingNames.HOME]);
              this.sendAdobeTrack(actionParams);
              this.tracking.trackEvent(AdobeEvent.successLogin);
            } else if (
              this.intentos >= this.attemptsLimit ||
              value.paramStr === 'Vuelva a intentarlo mas tarde' ||
              value.paramStr === 'El usuario esta bloqueado'
            ) {
              this.showModal(
                'Contraseña Incorrecta',
                'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos por whatsapp al 993 119 001.',
              );
              this.intento6 = true;
              this.sendAdobeTrack({
                ...actionParams,
                state: 'Intención de envío',
                typeError: value.paramStr,
              });
            } else if (this.intentos < this.attemptsLimit) {
              if (this.codRespuesta === loginResultStatus.errorCredentials) {
                this.showModal(
                  'Contraseña incorrecta',
                  `Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  ${this.intentosRestantes} intentos restantes.`,
                );
                this.sendAdobeTrack({
                  ...actionParams,
                  state: 'Intención de envío',
                  typeError: 'Contraseña incorrecta',
                });
              } else if (this.codRespuesta === loginResultStatus.userInactive) {
                this.showModal(
                  'Tu cuenta está siendo procesada',
                  'Estamos procesando la información de tu registro,' +
                    ' esto puede tomar un máximo 24 horas hábiles. Cuando esté lista te enviaremos un mail de Bienvenida.',
                  'Entendido',
                );
                this.sendAdobeTrack({
                  ...actionParams,
                  state: 'Intención de envío',
                  typeError: 'Tu cuenta está siendo procesada',
                });
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 500) {
              this.showModal(
                'Error',
                'Error del servidor comuníquese con el administrador',
              );
              this.sendAdobeTrack({
                ...actionParams,
                state: 'Intención de envío',
                typeError: 'Error del servidor',
              });
            }
          },
        });
    }
  }

  clickRecoverPassword() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Login',
      action: 'Click',
      label: 'Recuperar contraseña',
      detail: 'Recuperar contraseña',
      typeElement: 'Botón',
      location: 'Login',
    });
  }

  clickRegistration(disabled = false) {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Login',
      action: 'Click',
      label: 'Regístrate aquí',
      detail: 'Regístra tu empresa',
      typeElement: 'Botón',
      location: 'Login',
      step: 'step0',
    });
    if (disabled) {
      this.messageService.add({
        key: 'tc',
        severity: 'success',
        detail: AFFILIATION_SUSPENDED,
      });
    } else {
      void this.router.navigateByUrl(authFullRoutingNames.COMPANY_REGISTER, {
        state: { initNew: true },
      });
    }
  }

  sendAdobeTrack(action?: Partial<ActionEventProperties>) {
    this.tracking.trackEvent(AdobeEvent.login, action);
  }
}
