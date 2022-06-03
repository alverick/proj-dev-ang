import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { authFullRoutingNames } from '../auth-routing.names';

@Component({
  selector: 'app-identificar-empresa',
  templateUrl: './identificar-empresa.component.html',
  styleUrls: ['./identificar-empresa.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #fff;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px !important;
        padding: 0.5em 0.3em;
        min-width: 300px !important;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
        filter: brightness(0.5);
      }
    `,
  ],
})
export class IdentificarEmpresaComponent implements OnInit {
  registerForm: FormGroup;
  public inEdit: boolean = false;
  submittedRequired = false;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private afiliacionService: AfiliacionService
  ) {}

  // Obtención de conveniencia para un fácil acceso a los campos de formulario
  get f(): any {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.route.data.subscribe((d) => {
      this.inEdit = d.isEdit;
      if (d.isEdit == false) {
        window['_url_loop_'] = 'identificarEmpresa';
        this.registerForm = this.formBuilder.group({
          ruc: new FormControl({ value: '', disabled: this.inEdit }, [
            Validators.required,
            Validators.pattern('[1-2]0[0-9]+?'),
            Validators.minLength(11),
          ]),
          email: new FormControl({ value: '', disabled: this.inEdit }, [
            Validators.required,
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
            Validators.minLength(10),
            Validators.maxLength(100),
          ]),
          telefono: new FormControl({ value: '', disabled: this.inEdit }, [
            Validators.required,
            Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'),
            Validators.minLength(6),
            Validators.maxLength(9),
          ]),
          movilOperator: new FormControl('', [Validators.required]),
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submittedRequired = true;
    // var ruc  = this.registerForm.value.ruc.toString();

    if (this.registerForm.invalid) {
      return;
    }

    if (this.inEdit === false) {
      this.afiliacionService
        .ValidateClient({
          ruc: this.registerForm.value.ruc,
          //////*name: this.registerForm.value.nombre,
          //////*entry: this.registerForm.value.rubro,
          email: this.registerForm.value.email,
          movilNumber: this.registerForm.value.telefono,
          movilOperator: this.registerForm.value.movilOperator,
          //////*password: this.registerForm.value.contrasena,
          //////*acceptTerms: this.registerForm.value.acceptterms
        })
        .subscribe(
          (d) => {
            if (d.success) {
              this.afiliacionService.dataEnterpriseModel = {
                ruc: this.registerForm.value.ruc.toString(),
                email: this.registerForm.value.email.toString(),
                movilNumber: this.registerForm.value.telefono.toString(),
                movilOperator: this.registerForm.value.movilOperator.toString(),
                name: '',
                entry: '',
                newName: '',
                status: '',
              };
              this.router.navigate([
                authFullRoutingNames.COMPANY_FILL_DATA /*, this.registerForm.get('ruc')*/,
              ]);
            } else {
              switch (d.code) {
                case 1: {
                  this.showMessageExistsCustomer();
                  break;
                }
                case 2: {
                  this.showMessageNoExistsAccounts();
                  break;
                }
                case 3: {
                  this.showMessageNoExistsAccounts();
                  break;
                }
                default: {
                  this.showErrorServer();
                  break;
                }
              }
            }
          },
          (err) => {
            this.mensaje(
              'Regístrame',
              'Ha ocurrido un error con el servidor<br />Intente de nuevo'
            );
          }
        );
    } else {
      /*Esto faltaría implementar para la edición*/
      //////*if (this.gtpService.EmpresaServicios.newNameGTPStatus === 1) {
      //////*  this.gtpService.EdtEmpServ = { token: this.llave, NewName: null };
      //////*  this.gtpService.nombre = null;
      //////*} else {
      //////*  this.gtpService.EdtEmpServ = { token: this.llave, NewName: this.registerForm.value.nombre.toString() };
      //////*  this.gtpService.nombre = this.registerForm.value.nombre.toString();
      //////*}
      //////*this.afiliacionService.email = this.gtpService.EmpresaServicios.email;
      //////*this.router.navigate([authRoutingNames.SERVICES_EDIT_GTP]);
      //////*this.gtpService.llave = this.llave;
    }
  }

  showMessageExistsCustomer(): void {
    Swal.fire({
      //  type: 'warning',
      title: 'Crea tu cuenta',
      text: `El RUC: ${this.registerForm.value.ruc} ya se encuentra registrado en Cobro Simple`,
      showConfirmButton: true,
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }

  showMessageNoExistsRUC(): void {
    Swal.fire({
      //  type: 'warning',
      title: 'Crea tu cuenta',
      text: `El RUC: ${this.registerForm.value.ruc} no existe`,
      showConfirmButton: true,
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }

  showMessageNoExistsAccounts(): void {
    Swal.fire({
      // type: 'warning',
      title: 'Abre tu Cuenta Negocios',
      text: `Te llevaremos a la página web de Interbank para abrir la cuenta. Una vez que llenes el formulario regresa aquí.`,
      showConfirmButton: true,
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonText: 'CREAR MI CUENTA',
      onOpen: drawPopup,
    }).then((res) => {
      if (res.value) {
        /*Esto se debería cambiar porque las pantallas ahora son más*/
        //////*this.gaService.sendEvent('CrearCuentaNegocio', {
        //////*  'event_category': GoogleAnalytics.Afiliacion,
        //////*  'event_label': 'ir_a_crear_cuenta'
        //////*});
        window.open('https://interbank.pe/cuenta-negocios');
        this.router.navigate([authFullRoutingNames.LOGIN]);
      }
    });
  }

  showErrorServer() {
    this.mensaje(
      'Regístrame',
      'Ha ocurrido un error con el servidor<br />Intente de nuevo'
    );
  }

  enviarDatosEmpresa() {
    /*Esto se debería cambiar porque las pantallas ahora son más*/
    //////*this.gaService.sendEvent('EnviarDatosEmpresa', {
    //////*  'event_category': 'Afiliación',
    //////*  'event-label': 'enviar_datos_empresa'
    //////*});
  }

  goBack() {
    this.router.navigate([authFullRoutingNames.LOGIN]);
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
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }
}
