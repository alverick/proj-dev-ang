import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { authFullRoutingNames } from '../../auth-routing.names';

@Component({
  selector: 'cs-identificar-empresa',
  templateUrl: './identificar-empresa.page.html',
  styleUrls: ['./identificar-empresa.page.scss'],
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
export class IdentificarEmpresaPage implements OnInit {
  public inEdit = false;
  submittedRequired = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afiliacionService: AfiliacionService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((d) => {
      this.inEdit = d.isEdit;
      if (d.isEdit === false) {
      }
    });
  }

  onSubmit(registerForm) {
    this.afiliacionService
      .ValidateClient({
        ruc: registerForm.ruc,
        email: registerForm.email,
        movilNumber: registerForm.telefono,
        movilOperator: registerForm.movilOperator,
      })
      .subscribe(
        (d) => {
          if (d.success) {
            this.afiliacionService.dataEnterpriseModel = {
              ruc: registerForm.ruc.toString(),
              email: registerForm.email.toString(),
              movilNumber: registerForm.telefono.toString(),
              movilOperator: registerForm.movilOperator.toString(),
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
                this.showMessageExistsCustomer(registerForm);
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
  }

  showMessageExistsCustomer(registerForm): void {
    Swal.fire({
      //  type: 'warning',
      title: 'Crea tu cuenta',
      text: `El RUC: ${registerForm.ruc} ya se encuentra registrado en Cobro Simple`,
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
        ////// *this.gaService.sendEvent('CrearCuentaNegocio', {
        ////// *  'event_category': GoogleAnalytics.Afiliacion,
        ////// *  'event_label': 'ir_a_crear_cuenta'
        ////// *});
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
