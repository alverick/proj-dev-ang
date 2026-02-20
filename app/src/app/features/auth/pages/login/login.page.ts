import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, type OnInit, viewChild } from '@angular/core';
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
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { type Password, PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { first } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { internalFullRoutingNames } from '../../../../app-routing.collection';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { companyDocumentStorageName } from '../../../../shared/constants/company';
import { errorsLoginForm } from '../../../../shared/constants/company-errors';
import { AFFILIATION_SUSPENDED } from '../../../../shared/constants/message-service';
import { loginResultStatus } from '../../../../shared/constants/session';
import { ModelFormGroup } from '../../../../shared/models/forms';
import { RespuestaLogin } from '../../../../shared/models/respuestaLogin.model';
import { EncryptionService } from '../../../../shared/services/encryption.service';
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
    InputGroup,
    InputGroupAddon,
  ],
})
export class LoginPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly storageService = inject(StorageService);
  private readonly tracking = inject(TrackingService);
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  public loginForm: ModelFormGroup<LoginForm>;

  intentos: number;
  intentosRestantes = 6;
  codRespuesta: number;
  intento6 = false;
  readonly passwordControl = viewChild<Password>('passwordControl');
  protected readonly errorMessages = errorsLoginForm;

  linkRecoverPassword = authFullRoutingNames.RECOVER_PASSWORD;
  disabledAffiliation$ = this.store.select(
    appConfigFeature.selectDisabledAffiliation,
  );
  attemptsLimit = 6;
  recaptcha = inject(RecaptchaProviderService);
  token = '';

  encryptionService = inject(EncryptionService);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      ruc: ['', rucValidators],
      psw: ['', [Validators.required, Validators.maxLength(25)]],
      rememberMe: [false, Validators.required],
    });
    const rucStr = this.cookieService.check(companyDocumentStorageName)
      ? this.cookieService.get(companyDocumentStorageName)
      : userData[0];
    if (isNotNilOrEmpty(rucStr)) {
      this.checkStatusLoginForm(rucStr);
    }
  }

  checkStatusLoginForm(rucStr: string) {
    void this.encryptionService
      .getSessionEncryptionKey('local')
      .then((key) => {
        return this.encryptionService.decryptData(rucStr, key);
      })
      .then((ruc) => {
        this.loginForm.patchValue({ ruc, rememberMe: true });
        if (isNotNilOrEmpty(userData[0]) && isNotNilOrEmpty(userData[1])) {
          this.loginForm.patchValue({
            ruc: userData[0],
            psw: userData[1],
            rememberMe: false,
          });
        }
      });
  }

  get f() {
    return this.loginForm.controls;
  }

  showModal(title: string, text: string, confirmText = '', additional = {}) {
    void swalAlert.fire({
      title,
      text,
      showCloseButton: false,
      showConfirmButton: true,
      allowOutsideClick: false,
      confirmButtonText: confirmText || 'Cerrar',
      ...additional,
    });

    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: title,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
  }

  public async submitLogin() {
    if (!this.loginForm.valid) return;

    this.cookieService.delete(companyDocumentStorageName);
    const ruc = this.f.ruc.value;
    const password = this.f.psw.value;

    const actionParams: Partial<ActionEventProperties> =
      this.buildTrackingParams(ruc, this.passwordControl().unmasked);
    this.tracking.setRuc(ruc);

    try {
      this.token = await this.recaptcha.getToken('submit_form');
    } catch (err) {
      console.error('reCAPTCHA failed', err);
    }

    this.loginService
      .login(ruc, password, this.token)
      .pipe(first())
      .subscribe({
        next: (value) => this.handleLoginResponse(value, actionParams),
        error: (error: HttpErrorResponse) =>
          this.handleLoginError(error, actionParams),
      });
  }

  private buildTrackingParams(
    ruc: string,
    unmasked: boolean,
  ): Partial<ActionEventProperties> {
    return {
      category: 'Login',
      action: 'Click',
      label: 'Ingresar',
      state: 'Envío exitoso',
      metadata: [
        { key: 'TipoDocumento', value: 'RUC' },
        { key: 'NumeroDocumento', value: ruc },
        { key: 'MostrarPassword', value: unmasked },
      ],
    };
  }

  private handleLoginResponse(
    value: RespuestaLogin,
    actionParams: Partial<ActionEventProperties>,
  ) {
    this.intentos = value.paramNum;
    this.intentosRestantes = this.attemptsLimit - this.intentos;
    this.codRespuesta = value.codRespuesta;

    if (value.paramStr === 'Un session ya se encuentra activa') {
      this.showSessionActiveModal(value, actionParams);
      return;
    }

    if (value.estado && this.intentos <= this.attemptsLimit) {
      void this.processSuccessfulLogin(value, actionParams);
      return;
    }

    if (
      this.intentos >= this.attemptsLimit ||
      ['Vuelva a intentarlo mas tarde', 'El usuario esta bloqueado'].includes(
        value.paramStr,
      )
    ) {
      this.handleBlockedUser(value, actionParams);
      return;
    }

    this.handleFailedAttempt(actionParams);
  }

  private showSessionActiveModal(
    value: RespuestaLogin,
    actionParams: Partial<ActionEventProperties>,
  ) {
    this.showModal('Existe una sesión activa', '');
    this.sendAdobeTrack({
      ...actionParams,
      state: 'Intención de envío',
      typeError: value.paramStr,
    });
  }

  private async processSuccessfulLogin(
    value: RespuestaLogin,
    actionParams: Partial<ActionEventProperties>,
  ) {
    if (this.f.rememberMe.value) {
      const expire = new Date();
      expire.setDate(expire.getDate() + 25);
      this.cookieService.set(
        companyDocumentStorageName,
        this.f.ruc.value,
        expire,
      );
      const processedDocument = await this.encryptionService.encryptData(
        this.f.ruc.value,
        await this.encryptionService.getSessionEncryptionKey('local'),
      );
      this.cookieService.set(
        companyDocumentStorageName,
        processedDocument,
        expire,
      );
    }

    window.sessionStorage.setItem('username', value.id);
    void this.router.navigate([internalFullRoutingNames.HOME]);

    this.sendAdobeTrack(actionParams);
    this.tracking.trackEvent(AdobeEvent.successLogin);
  }

  private handleBlockedUser(
    value: RespuestaLogin,
    actionParams: Partial<ActionEventProperties>,
  ) {
    this.showModal(
      'Contraseña Incorrecta',
      'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. ' +
        'Si tienes problemas para ingresar a tu cuenta, contáctanos por whatsapp al 993 119 001.',
    );
    this.intento6 = true;

    this.sendAdobeTrack({
      ...actionParams,
      state: 'Intención de envío',
      typeError: value.paramStr,
    });
  }

  private handleFailedAttempt(actionParams: Partial<ActionEventProperties>) {
    type ModalArgs = Parameters<typeof this.showModal>;

    const errorMap: Record<
      string,
      {
        modal: ModalArgs;
        adobeTrack: Partial<ActionEventProperties>;
      }
    > = {
      [loginResultStatus.errorCredentials]: {
        modal: [
          'Contraseña incorrecta',
          `Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes ${this.intentosRestantes} intentos restantes.`,
        ],
        adobeTrack: {
          state: 'Intención de envío',
          typeError: 'Contraseña incorrecta',
        },
      },
      [loginResultStatus.userError]: {
        modal: [
          'No se pudo iniciar sesión',
          'No logramos confirmar tu información. Inténtalo nuevamente.',
          'Vuelve a intentarlo',
          {
            iconHtml:
              '<img alt="" class="tw-w-20 tw-max-w-none" src="assets/images/icon-error-login.svg"/>',
          },
        ],
        adobeTrack: {
          state: 'Intención de envío',
          typeError: 'Tu cuenta está siendo procesada',
        },
      },
      [loginResultStatus.userInactive]: {
        modal: [
          'Tu cuenta está siendo procesada',
          'Estamos procesando la información de tu registro, esto puede tomar un máximo 24 horas hábiles. ' +
            'Cuando esté lista te enviaremos un mail de Bienvenida.',
          'Entendido',
        ],
        adobeTrack: {
          state: 'Intención de envío',
          typeError: 'Tu cuenta está siendo procesada',
        },
      },
    };

    const config = errorMap[this.codRespuesta];
    if (!config) return;

    this.showModal(...config.modal);
    this.sendAdobeTrack({ ...actionParams, ...config.adobeTrack });
  }

  private handleLoginError(
    error: HttpErrorResponse,
    actionParams: Partial<ActionEventProperties>,
  ) {
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
