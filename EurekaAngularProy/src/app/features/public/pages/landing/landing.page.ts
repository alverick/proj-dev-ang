import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import { GoogleAnalytics } from '../../../../shared/services/googleAnalytics.service';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';

interface ItemLanding {
  title: string;
  content: string;
  position?: string;
}

@Component({
  selector: 'cs-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  providers: [DialogService],
})
export class LandingPage implements OnInit, OnDestroy {
  ref: DynamicDialogRef;
  linkLogin = authFullRoutingNames.LOGIN;
  benefits: ItemLanding[] = [
    {
      title: 'Sin compartir número de cuenta',
      content:
        'Tus clientes podrán pagarte a través de "Pago de Servicios" en los canales digitales de Interbank y en más de 4,500 agentes.',
    },
    {
      title: 'Configura tus cobros',
      content:
        'Elige el orden de pago de las deudas, si recibirás pagos por partes o incluirás el cobro de moras.',
    },
    {
      title: 'Cobranzas al instante',
      content:
        'Podrás identificar los pagos de cada cliente y ver el estado de pago en tiempo real.',
    },
    {
      title: 'Descarga reportes',
      content:
        'Para facilitar tu proceso de conciliación y seguimiento de cobranzas.',
    },
  ];
  howWorks: ItemLanding[][] = [
    [
      {
        title: 'Regístrate',
        position: '01',
        content: 'Crea tu contraseña y configura los cobros de tu empresa.',
      },
      {
        title: 'Ingresa y carga* tu lista de clientes por cobrar',
        position: '02',
        content:
          'Ingresa a la plataforma con tu RUC y contraseña, luego carga tu lista de clientes en la sección “agregar cobros”. <br /><br />*Sólo si eliges la opción de ingresar datos de tus clientes.',
      },
    ],
    [
      {
        title: 'Empieza a recibir los pagos de tus clientes',
        position: '03',
        content:
          'Ellos podrán pagarte buscando el nombre de tu empresa en el APP o Web de Interbank.',
      },
      {
        title: 'Identifica y concilia los pagos recibidos',
        position: '04',
        content:
          'Puedes ver en tiempo real desde la plataforma, quién te pagó y exportar reportes para analizar tus cobranzas.',
      },
    ],
  ];
  payments: ItemLanding[] = [
    {
      title: 'Pagos parciales',
      content:
        'Configura si permitirás a tus clientes pagar su deuda total por partes',
    },
    {
      title: 'Pagos sucesivos',
      content:
        'Podrás hacer que tus clientes paguen la deuda más antigua primero o la que ellos deseen',
    },
    {
      title: 'Cobro de mora',
      content:
        'Configura si deseas que tus clientes paguen una mora y define el importe de esta',
    },
  ];

  constructor(
    private gaService: GoogleAnalytics,
    public router: Router,
    public dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit() {
    this.gaService.sendEvent('Landing', {
      event_category: 'Landing',
      event_label: 'ingreso_landing',
    });
  }

  clickRegistrarse() {
    this.gaService.sendEvent('Registrarme', {
      event_category: GoogleAnalytics.Afiliacion,
      event_label: 'registrarme',
    });
    void this.router.navigateByUrl(authFullRoutingNames.COMPANY_REGISTER, {
      state: { initNew: true },
    });
  }

  clickLogin() {
    this.gaService.sendEvent('Registrarme', {
      event_category: GoogleAnalytics.Afiliacion,
      event_label: 'registrarme',
    });
  }

  showModalTerms() {
    this.ref = this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });
  }
}
