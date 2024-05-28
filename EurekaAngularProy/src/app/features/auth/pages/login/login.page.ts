import { type OnInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { internalFullRoutingNames } from '../../../../app-routing.collection';
import { AFFILIATION_SUSPENDED } from '../../../../shared/constants/message-service';
import { loginResultStatus } from '../../../../shared/constants/session';
import { type ModelFormGroup } from '../../../../shared/models/forms';
import { LoginService } from '../../../../shared/services/login.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { appConfigFeature } from '../../../../store/reducers/app-config.reducer';
import { authFullRoutingNames } from '../../auth-routing.names';

const userData = environment.credentials[0];

interface LoginForm {
  ruc: string;
  psw: string;
  rememberme: boolean;
}

@Component({
  selector: 'cs-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [MessageService],
})
export class LoginPage implements OnInit {
  public loginForm: ModelFormGroup<LoginForm>;
  public submitted = false;
  public error: { ruc: string; message: string } = null;
  public formData: any = {};
  public rememberMe = false;
  inputUsuaValid = false;
  inputPassValid = false;
  validarCantRuc = false;
  validarCantPass = false;

  intentos: number;
  intentosRestantes = 6;
  codRespuesta: number;
  err: boolean;
  intento6 = false;
  ruc = 0;
  codigo2 = false;
  isCaptchaValidate = true;
  hide = true;

  account_validation_messages = {
    ruc: [
      // hasError
      { type: 'required', message: 'Debes ingresar un RUC' },
      // { type: 'minlength', message: 'Ingrese un RUC válido de 11 dígitos' },
      { type: 'pattern', message: 'Debe contener solo números' },
    ],
    psw: [
      { type: 'required', message: 'Debe ingresar el password' },
      // { type: 'minlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres' },
      {
        type: 'maxlength',
        message: 'Debes ingresar una contraseña entre 6 y 20 caracteres',
      },
    ],
  };
  linkRecoverPassword = authFullRoutingNames.RECOVER_PASSWORD;
  linkRegisterCompany = authFullRoutingNames.COMPANY_REGISTER;
  disabledAffiliation$ = this.store.select(
    appConfigFeature.selectDisabledAffiliation
  );
  attemptsLimit = 6;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private storageService: StorageService,
    public snackBar: MatSnackBar,
    private tracking: TrackingService,
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.snackBar.dismiss();
    const rucStr = this.cookieService.check('ruc')
      ? this.cookieService.get('ruc')
      : userData[0];

    this.validationLogin(rucStr);
  }

  validationLogin(rucStr: any) {
    if (rucStr) {
      this.rememberMe = true;
    }

    this.loginForm = this.formBuilder.group({
      ruc: [
        rucStr,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      psw: [userData[1], Validators.required],
      rememberme: [this.rememberMe, Validators.required],
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

  focusFunctionRuc() {
    this.inputUsuaValid = false;
    this.validarCantRuc = false;
    this.codigo2 = false;
  }
  focusFunctionPass() {
    this.inputPassValid = false;
    this.validarCantPass = false;
    this.codigo2 = false;
  }

  public submitLogin(): any {
    let continuar = true;

    if (this.loginForm.get('ruc').value.length === 0) {
      this.inputUsuaValid = true;
      continuar = false;
    } else if (this.loginForm.get('ruc').value.length < 11) {
      this.validarCantRuc = true;
      continuar = false;
    }

    if (this.loginForm.get('psw').value.length === 0) {
      this.inputPassValid = true;
      continuar = false;
    } else if (
      this.loginForm.get('psw').value.length < 6 ||
      this.loginForm.get('psw').value.length > 25
    ) {
      this.validarCantPass = true;
      continuar = false;
    }

    if (!continuar) {
      return;
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
          value: !this.hide,
        },
      ],
    };

    this.tracking.setRuc(this.f.ruc.value);

    if (this.loginForm.valid) {
      this.loginService
        .login(this.f.ruc.value, this.f.psw.value)
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
              if (this.rememberMe === true) {
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
              this.codigo2 = false;

              this.showModal(
                'Contraseña Incorrecta',
                'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos por whatsapp al 993 119 001.'
              );
              this.intento6 = true;
              this.sendAdobeTrack({
                ...actionParams,
                state: 'Intención de envío',
                typeError: value.paramStr,
              });
            } else if (this.intentos < this.attemptsLimit) {
              if (this.codRespuesta === loginResultStatus.notRegistered) {
                this.codigo2 = true;
              } else if (
                this.codRespuesta === loginResultStatus.errorCredentials
              ) {
                this.codigo2 = false;

                this.showModal(
                  'Contraseña incorrecta',
                  `Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  ${this.intentosRestantes} intentos restantes.`
                );
                this.sendAdobeTrack({
                  ...actionParams,
                  state: 'Intención de envío',
                  typeError: 'Contraseña incorrecta',
                });
              } else if (this.codRespuesta === loginResultStatus.userInactive) {
                this.codigo2 = false;

                this.showModal(
                  'Tu cuenta está siendo procesada',
                  'Estamos procesando la información de tu registro,' +
                    ' esto puede tomar un máximo 24 horas hábiles. Cuando esté lista te enviaremos un mail de Bienvenida.',
                  'Entendido'
                );
                this.sendAdobeTrack({
                  ...actionParams,
                  state: 'Intención de envío',
                  typeError: 'Tu cuenta está siendo procesada',
                });
              }
            }
          },
          error: (error) => {
            if (error.status === 500) {
              this.showModal(
                'Error',
                'Error del servidor comuníquese con el administrador'
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
