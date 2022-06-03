import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { internalFullRoutingNames } from 'src/app/app-routing.collection';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { authFullRoutingNames } from '../../auth-routing.names';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public submitted = false;
  public error: { ruc: string; message: string } = null;
  public respuestaHttp: number;
  public formData: any = {};
  public rememberMe = false;

  public inputUsuario = false;
  // @ViewChild('inputUsua') inputUsua: ElementRef;
  // @ViewChild('inputPass') inputPass: ElementRef;
  inputUsuaValid = false;
  inputPassValid = false;
  validarCantRuc = false;
  validarCantPass = false;

  intentos: number;
  intentosRestantes = 6;
  codRespuesta: number;
  err: boolean;
  numero2: number;
  intento6 = false;
  ruc = 0;

  isTrue = false;
  codigo2 = false;
  isCaptchaValidate = true;

  storeRuc: any;

  @ViewChild('recaptchaRef', { static: true })
  recaptchaRef: RecaptchaComponent;

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

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private storageService: StorageService,
    public snackBar: MatSnackBar,
    private gaService: GoogleAnalytics
  ) {}

  ngOnInit() {
    this.snackBar.dismiss();
    const rucStr = this.cookieService.check('ruc')
      ? this.cookieService.get('ruc')
      : '';

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
      psw: ['', Validators.required],
      rememberme: [this.rememberMe, Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  resolved(captchaResponse: string): boolean {
    this.isCaptchaValidate = true;
    return true;
  }

  mensaje(tipo: any, titulo: string, text: string) {
    Swal.fire({
      // type: tipo ,
      title: titulo,
      text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      // cancelButtonText:  'CERRAR',
      allowOutsideClick: false,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
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
      this.loginForm.get('psw').value.length > 20
    ) {
      this.validarCantPass = true;
      continuar = false;
    }

    if (!continuar) {
      return;
    }

    this.cookieService.delete('ruc');

    if (this.loginForm.valid && this.isCaptchaValidate) {
      this.spinner.show();

      this.loginService
        .login(this.f.ruc.value, this.f.psw.value)
        .pipe(first())
        .subscribe(
          (value) => {
            this.storageService.setIntentos(value.paramNum);
            this.intentos = this.storageService.getIntentos();

            this.intentosRestantes = 6 - this.intentos;
            this.codRespuesta = value.codRespuesta;
            if (value.paramStr === 'Un session ya se encuentra activa') {
              Swal.fire({
                // imageUrl: '/assets/images/complain.svg',
                imageHeight: 100,
                title: 'Existe una Sesión Activa',
                // cancelButtonText: 'CERRAR',
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                cancelButtonColor: '#d33',
                // cancelButtonText:  'CERRAR',
                allowOutsideClick: false,
                confirmButtonText: 'CERRAR',
                onOpen: drawPopup,
              });
            } else if (value.estado === true && this.intentos <= 6) {
              if (this.rememberMe === true) {
                const expire = new Date();
                expire.setDate(expire.getDate() + 25);
                this.cookieService.set('ruc', this.f.ruc.value, expire);
              }

              this.router.navigate([internalFullRoutingNames.HOME]);
              this.spinner.hide();
            } else if (this.intentos < 4 && this.codRespuesta === 2) {
              this.codigo2 = true;
            } else if (this.intentos < 4 && this.codRespuesta === 3) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Contraseña Incorrecta',
                'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  ' +
                  this.intentosRestantes +
                  ' intentos restantes'
              );
            } else if (this.intentos < 4 && this.codRespuesta === 5) {
              this.codigo2 = false;

              Swal.fire({
                // type: tipo ,
                title: 'Tu cuenta está siendo procesada',
                html:
                  'Estamos procesando la información de tu registro,' +
                  ' esto puede tomar un máximo 24 horas hábiles. Cuando esté lista te enviaremos un mail de Bienvenida.',
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                cancelButtonColor: '#d33',
                // cancelButtonText:  'CERRAR',
                allowOutsideClick: false,
                confirmButtonText: 'ENTENDIDO',
                onOpen: drawPopup,
              });
            } else if (this.intentos === 4 && this.codRespuesta === 2) {
              this.loginService.errores = value.codRespuesta;
              this.isCaptchaValidate = false;
              this.recaptchaRef !== undefined
                ? this.recaptchaRef.reset()
                : null;
              this.isTrue = true;
              this.codigo2 = true;
            } else if (this.intentos == 4 && this.codRespuesta == 3) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Contraseña Incorrecta',
                'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  ' +
                  this.intentosRestantes +
                  ' intentos restantes'
              );

              this.isCaptchaValidate = false;
              this.recaptchaRef !== undefined
                ? this.recaptchaRef.reset()
                : null;
              this.isTrue = true;
            } else if (this.intentos == 4 && this.codRespuesta == 5) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Cuenta Inactiva',
                'Su cuenta se encuentra inactiva'
              );

              this.isCaptchaValidate = false;
              this.recaptchaRef !== undefined
                ? this.recaptchaRef.reset()
                : null;
              this.isTrue = true;
            } else if (this.intentos == 5 && this.codRespuesta == 2) {
              this.isTrue = true;
              this.codigo2 = true;
            } else if (this.intentos == 5 && this.codRespuesta == 3) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Contraseña Incorrecta',
                'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  ' +
                  this.intentosRestantes +
                  ' intentos restantes'
              );
              this.recaptchaRef !== undefined
                ? this.recaptchaRef.reset()
                : null;
              this.isCaptchaValidate = false;
              this.isTrue = true;
              this.codigo2 = false;
            } else if (this.intentos == 5 && this.codRespuesta == 5) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Cuenta Inactiva',
                'Su cuenta se encuentra inactiva'
              );
              this.recaptchaRef !== undefined
                ? this.recaptchaRef.reset()
                : null;
              this.isCaptchaValidate = false;
              this.isTrue = true;
              this.codigo2 = false;
            } else if (
              this.intentos >= 6 ||
              value.paramStr === 'Vuelva a intentarlo mas tarde' ||
              value.paramStr === 'El usuario esta bloqueado'
            ) {
              this.codigo2 = false;

              this.mensaje(
                'error',
                'Contraseña Incorrecta',
                'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos a solucionesBPE@intercorp.com.pe '
              );
              this.intento6 = true;
              this.isTrue = false;
            }
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 500) {
              this.mensaje(
                'error',
                'Error',
                'Error del Servidor comuniquese con el administrador'
              );
            }
          },
          () => this.spinner.hide()
        );
    }
  }

  clickRegistrarse() {
    this.gaService.sendEvent('Registrarme', {
      event_category: GoogleAnalytics.Afiliacion,
      event_label: 'registrarme',
    });
  }
}
