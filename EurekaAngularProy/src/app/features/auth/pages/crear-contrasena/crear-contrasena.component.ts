import { Component, HostListener, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { authFullRoutingNames } from 'src/app/app-routing.collection';
import { IEntryModel } from 'src/app/shared/models';
import { ICompanyData } from 'src/app/shared/models/company-data';
import { IDataEnterpriseModel } from 'src/app/shared/models/data-enterprise.model';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { MustMatch } from '../../../../shared/validators/must-match.validator';

declare var $: any;
@Component({
  selector: 'cs-crear-contrasena',
  templateUrl: './crear-contrasena.component.html',
  styleUrls: ['./crear-contrasena.component.scss'],
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
export class CrearContrasenaComponent implements OnInit {
  registerForm: UntypedFormGroup;
  submitted: boolean = false;
  submittedRequired = false;

  public llave: string;
  public inEdit: boolean = false;
  public empresa: ICompanyData;
  public empresasEdit: IDataEnterpriseModel;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private afiliacionService: AfiliacionService,
    private router: Router,
    private gaService: GoogleAnalytics,
    private route: ActivatedRoute,
    private rutaActiva: ActivatedRoute,
    public gtpService: GtpService
  ) {}

  rubros: IEntryModel[] = [];

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {
    if (!this.afiliacionService.Guardado) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.route.data.subscribe((d) => {
      this.inEdit = d.isEdit;

      if (d.isEdit) {
        this.llave = this.rutaActiva.snapshot.params.llave.toString();
        this.llave = this.rutaActiva.snapshot.params.llave.toString();
        this.registerForm = this.formBuilder.group(
          {
            ruc: new UntypedFormControl({ value: '', disabled: this.inEdit }, [
              Validators.required,
              Validators.pattern('[1-2]0[0-9]+?'),
              Validators.minLength(11),
            ]),
            nombre: new UntypedFormControl({ value: '' }, [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(80),
            ]),
            rubro: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [Validators.required]
            ),
            email: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.pattern(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
                Validators.minLength(10),
                Validators.maxLength(100),
              ]
            ),
            telefono: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.pattern(/^9\d{8}$/),
                Validators.minLength(9),
                Validators.maxLength(9),
              ]
            ),
            movilOperator: new UntypedFormControl(
              { value: 'M', disabled: this.inEdit },
              [Validators.required]
            ),
            contrasena: new UntypedFormControl({
              value: '',
              disabled: this.inEdit,
            }),
            repcontrasena: new UntypedFormControl({
              value: '',
              disabled: this.inEdit,
            }),
            acceptterms: new UntypedFormControl({
              value: true,
              disabled: this.inEdit,
            }),
          },
          {
            validator: MustMatch('contrasena', 'repcontrasena'),
          }
        );

        this.ObtenerDatos().subscribe(() => {
          if (!this.gtpService.EmpresaServicios.inReview) {
            this.onSubmit();
            return;
          }
          this.empresasEdit = {
            ruc: this.gtpService.EmpresaServicios.ruc,
            name: this.gtpService.EmpresaServicios.name,
            entry: this.gtpService.EmpresaServicios.entry,
            email: this.gtpService.EmpresaServicios.email,
            movilNumber: this.gtpService.EmpresaServicios.movilNumber,
            movilOperator: this.gtpService.EmpresaServicios.movilOperator,
            newName: this.gtpService.EmpresaServicios.newName,
            status: this.gtpService.EmpresaServicios.status,
            newNameGTPStatus: this.gtpService.EmpresaServicios.newNameGTPStatus,
            requestDate: this.gtpService.EmpresaServicios.requestDate,
            inReview: false,
          };

          this.f.nombre.disable();
          if (this.gtpService.EmpresaServicios.inReview) {
            // this.f.nombre.disable();
            this.registerForm.get('nombre').enable();
          }
          this.registerForm.setValue({
            ruc: this.gtpService.EmpresaServicios.ruc,
            nombre:
              this.gtpService.EmpresaServicios.newNameGTPStatus === 3
                ? this.gtpService.EmpresaServicios.newName
                : this.gtpService.EmpresaServicios.name,
            rubro: this.gtpService.EmpresaServicios.entry,
            email: this.gtpService.EmpresaServicios.email,
            telefono: this.gtpService.EmpresaServicios.movilNumber,
            movilOperator: this.gtpService.EmpresaServicios.movilOperator,
            contrasena: '',
            repcontrasena: '',
            acceptterms: true,
          });
        });
      } else {
        this.registerForm = this.formBuilder.group(
          {
            ruc: new UntypedFormControl({ value: '', disabled: this.inEdit }, [
              Validators.required,
              Validators.pattern('[1-2]0[0-9]+?'),
              Validators.minLength(11),
            ]),
            nombre: new UntypedFormControl('', [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(80),
            ]),
            rubro: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [Validators.required]
            ),
            email: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.pattern(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
                Validators.minLength(10),
                Validators.maxLength(100),
              ]
            ),
            telefono: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.pattern(/^9\d{8}$/),
                Validators.minLength(9),
                Validators.maxLength(9),
              ]
            ),
            movilOperator: new UntypedFormControl('', [Validators.required]),
            contrasena: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UnaLetra,
              ]
            ),
            repcontrasena: new UntypedFormControl(
              { value: '', disabled: this.inEdit },
              [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UnaLetra,
              ]
            ),
            acceptterms: new UntypedFormControl(
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
  }

  // Obtención de conveniencia para un fácil acceso a los campos de formulario
  get f(): any {
    return this.registerForm.controls;
  }

  ObtenerDatos(): Observable<any> {
    return new Observable((obs) => {
      this.gtpService
        .GetEnterpriseServices({ TokenEncrypted: this.llave })
        .subscribe((d) => {
          if (d === null) {
            this.mensaje(
              'Enlace expirado',
              'El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro'
            );
            this.router.navigate([authFullRoutingNames.LOGIN]);
            obs.error();
          } else {
            this.afiliacionService.idCompany = d.id;
            this.gtpService.EmpresaServicios = d;

            this.gtpService.EmpresaServicios.arrayServices.forEach(
              (service) =>
                (service.useAgencyChannel =
                  this.gtpService.EmpresaServicios.useAgencyChannel)
            );
            /*   let servicios = [];
               this.gtpService.EmpresaServicios.arrayServices = [];
               d.ArrayServices.array.forEach(s => {
                 servicios.push({
                   id: s.id,
                   name: s.name,
                   debtorCode: s.debtorCode,
                   dataType: s.dataType,
                   paymentType: s.paymentType,
                   idAccount: s.idAccount,
                   accountNumber: s.accountNumber,
                   currency: s.currency,
                   usaWebApp: s.useAppWeb,
                   usaAgente: s.useAgent,
                   usaTienda: s.useStore,
                   partialPayment: s.partialPayment,
                   chargeInterest: s.chargeInterest,
                   chargeType: s.chargeType.toString(),
                   interestType: s.interestType,
                   amount: s.amount,
                   porcentage: s.percentage,
                   currencySymbol: s.currencySymbol,
                   inReview: s.inReview,
                   newNameCode: s.newNameCode,
                   newName: s.newName,
                   status: s.status
                 });
               });
               this.gtpService.EmpresaServicios.arrayServices = servicios;
              */
            obs.next();
            obs.complete();
            // this.empresa = this.gtpService.EmpresaServicios;
          }
        });
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
        .Registrar({
          ruc: this.registerForm.value.ruc,
          name: this.registerForm.value.nombre,
          entry: this.registerForm.value.rubro,
          email: this.registerForm.value.email,
          movilNumber: this.registerForm.value.telefono,
          movilOperator: this.registerForm.value.movilOperator,
          password: this.registerForm.value.contrasena,
          acceptTerms: this.registerForm.value.acceptterms,
        })
        .subscribe(
          (d) => {
            if (d.success) {
              this.router.navigate([
                '/configurarServicios' /*, this.registerForm.get('ruc')*/,
              ]);
            } else {
              if (d.code === 1) {
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
              } else {
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
                    this.gaService.sendEvent('CrearCuentaNegocio', {
                      event_category: GoogleAnalytics.Afiliacion,
                      event_label: 'ir_a_crear_cuenta',
                    });
                    window.open('https://interbank.pe/cuenta-negocios');
                    this.router.navigate([authFullRoutingNames.LOGIN]);
                  }
                });
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
      if (this.gtpService.EmpresaServicios.newNameGTPStatus === 1) {
        this.gtpService.EdtEmpServ = { token: this.llave, NewName: null };
        this.gtpService.nombre = null;
      } else {
        this.gtpService.EdtEmpServ = {
          token: this.llave,
          NewName: this.registerForm.value.nombre.toString(),
        };
        this.gtpService.nombre = this.registerForm.value.nombre.toString();
      }
      this.afiliacionService.email = this.gtpService.EmpresaServicios.email;
      this.router.navigate([authFullRoutingNames.SERVICES_EDIT_GTP]);
      this.gtpService.llave = this.llave;
    }
  }

  MensajeName() {
    //
    if (this.inEdit) {
      if (
        this.gtpService.EmpresaServicios &&
        this.gtpService.EmpresaServicios.newNameGTPStatus === 1
      ) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  terminos() {
    $('#terminos').modal('show');
    // alert('hola');
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

  enviarDatosEmpresa() {
    this.gaService.sendEvent('EnviarDatosEmpresa', {
      event_category: 'Afiliación',
      'event-label': 'enviar_datos_empresa',
    });
  }
}

function UnaLetra(c: UntypedFormControl) {
  let regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}
