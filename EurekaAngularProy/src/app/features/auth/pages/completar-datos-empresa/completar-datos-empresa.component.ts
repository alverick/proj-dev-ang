import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RubroModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { authFullRoutingNames } from '../../auth-routing.names';
import { MustMatch } from '../crear-contrasena/must-match.validator';

declare var $: any;

@Component({
  selector: 'app-completar-datos-empresa',
  templateUrl: './completar-datos-empresa.component.html',
  styleUrls: ['./completar-datos-empresa.component.scss'],
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
export class CompletarDatosEmpresaComponent implements OnInit {
  registerForm: FormGroup;
  submittedRequired = false;
  public inEdit: boolean = false;
  rubros: RubroModel[] = [];
  submitted: boolean = false;
  ruc: string = '';

  get f(): any {
    return this.registerForm.controls;
  }
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private afiliacionService: AfiliacionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe((d) => {
      this.inEdit = d.isEdit;

      if (d.isEdit == false) {
        window['_url_loop_'] = authFullRoutingNames.GENERATE_PASSWORD;
        this.registerForm = this.formBuilder.group(
          {
            nombre: new FormControl('', [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(80),
            ]),
            rubro: new FormControl({ value: '', disabled: this.inEdit }, [
              Validators.required,
            ]),
            contrasena: new FormControl({ value: '', disabled: this.inEdit }, [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
              UnaLetra,
            ]),
            repcontrasena: new FormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UnaLetra,
              ]
            ),
            acceptterms: new FormControl(
              { value: '', disabled: this.inEdit },
              Validators.requiredTrue
            ),
          },
          {
            validator: MustMatch('contrasena', 'repcontrasena'),
          }
        );
      }
    });

    this.afiliacionService.GetRubros().subscribe((d) => (this.rubros = d));

    this.ruc = this.afiliacionService.dataEnterpriseModel.ruc.toString();
  }

  goBack() {
    this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
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
        .Registrar({
          ruc: this.afiliacionService.dataEnterpriseModel.ruc.toString(),
          name: this.registerForm.value.nombre,
          entry: this.registerForm.value.rubro,
          email: this.afiliacionService.dataEnterpriseModel.email.toString(),
          movilNumber:
            this.afiliacionService.dataEnterpriseModel.movilNumber.toString(),
          movilOperator:
            this.afiliacionService.dataEnterpriseModel.movilOperator.toString(),
          password: this.registerForm.value.contrasena,
          acceptTerms: this.registerForm.value.acceptterms,
        })
        .subscribe(
          (d) => {
            if (d.success) {
              this.afiliacionService.dataEnterpriseModel = {
                ruc: '',
                email: '',
                movilNumber: 0,
                movilOperator: '',
                name: '',
                entry: '',
                newName: '',
                status: '',
              };
              this.router.navigate([authFullRoutingNames.COMPANY_FINISHED]);
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

  enviarDatosEmpresa() {
    /*Esto se debería cambiar porque las pantallas ahora son más*/
    //////*this.gaService.sendEvent('EnviarDatosEmpresa', {
    //////*  'event_category': 'Afiliación',
    //////*  'event-label': 'enviar_datos_empresa'
    //////*});
  }

  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, ' ');
    this.f.nombre.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ''));
  }

  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }

  MensajeName() {
    //

    //////*if (this.inEdit) {
    //////*  if (this.gtpService.EmpresaServicios && this.gtpService.EmpresaServicios.newNameGTPStatus === 1) {
    //////*    return false;
    //////*  } else {
    //////*    return true;
    //////*  }
    //////*}
    return false;
  }

  terminos() {
    $('#terminos').modal('show');
    // alert('hola');
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

function UnaLetra(c: FormControl) {
  let regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}
