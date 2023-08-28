import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
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
export class LandingPage implements OnDestroy {
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
    public router: Router,
    public dialogService: DialogService,
    private adobeAnalytics: AdobeAnalyticsService
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  clickRegistration(category: string, location: string) {
    void this.router.navigateByUrl(authFullRoutingNames.COMPANY_REGISTER, {
      state: { initNew: true },
    });
    this.sendAdobeTrack({
      category,
      action: 'Click',
      label: 'Regístrate',
      detail: 'Regístra tu empresa',
      typeElement: 'Botón',
      location,
      step: 'step0',
    });
  }

  clickLogin() {
    void this.router.navigateByUrl(authFullRoutingNames.LOGIN, {
      state: { initNew: true },
    });
    this.sendAdobeTrack({
      category: 'Login - hero',
      action: 'Click',
      label: 'Inicia sesión',
      detail: 'Login',
      typeElement: 'Botón',
      location: 'hero',
      step: 'step0',
    });
  }

  sendAdobeTrack(action: Partial<ActionEventProperties>) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, action);
  }

  showModalTerms() {
    this.ref = this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });

    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Términos y condiciones',
      action: 'Click',
      detail: 'Términos y condiciones',
      label: 'Términos y condiciones',
      typeElement: 'Link',
      location: 'Footer',
    });

    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: 'Términos y condiciones',
      action: 'modal-view',
      detail: 'Términos y condiciones',
      location: 'Modal',
    });
  }

  clickWa() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Contáctanos',
      action: 'Click',
      detail: 'Enlace a whatsapp',
      label: '993 119 001',
      typeElement: 'Link',
      location: 'Footer',
    });
  }
}
