import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { authFullRoutingNames } from 'src/app/app-routing.collection';
import { RecuperaService } from 'src/app/shared/services/recupera.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';

@Component({
  selector: 'cs-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
})
export class RecuperarContrasenaComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private recuperaService: RecuperaService,
    private router: Router
  ) {}
  public formulario = true;
  recupera: FormGroup;
  public submitted = false;
  isCaptchaValidate = false;
  submittedRequired = false;

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (!this.formulario) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.recupera = this.formBuilder.group({
      ruc: new FormControl('', [
        Validators.required,
        Validators.pattern('[1-2]0[0-9]+?'),
        Validators.minLength(11),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      // captcha: new FormControl( '',  [Validators.required])
    });
  }

  get f(): any {
    return this.recupera.controls;
  }

  resolved(captchaResponse: string): boolean {
    this.isCaptchaValidate = true;
    return true;
  }

  SubmitRecupera() {
    this.submittedRequired = true;
    if (this.recupera.valid && this.isCaptchaValidate == true) {
      this.recuperaService
        .RecoverPassword({
          RUC: this.recupera.value.ruc,
          Email: this.recupera.value.email,
        })
        .subscribe((d) => {
          if (d === true) {
            this.mensaje(
              'Hemos recibido tus datos',
              'Estamos revisando los datos que ingresaste, en caso de que sean correctos recibirás un correo electrónico con indicaciones para acceder a tu cuenta'
            );
            this.formulario = false;
            this.f.ruc.reset();
            this.f.ruc.clearValidators();
            this.f.email.reset();
            this.f.email.clearValidators();
            // al ocultar la pantalla se mostrara en la parte de arriba la pagina
            this.router.navigate([authFullRoutingNames.LOGIN]);
          } else {
            this.mensaje('Hemos recibido tus datos', 'Ingrese datos validos');
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
            'Se ha reenviado un correo electrónico con indicaciones para acceder a tu cuenta'
          );
          this.formulario = false;
        } else {
          this.mensaje('Hemos recibido tus datos', 'Ingrese datos validos');
        }
      });
  }

  mensaje(titulo: string, text: string) {
    Swal.fire({
      // type: tipo ,
      title: titulo,
      html: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ENTENDIDO',
      onOpen: drawPopup,
    });
  }
}
