import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { appConfigFeature } from '../../../../store/reducers/app-config.reducer';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';

interface ItemLanding {
  title: string;
  content: string;
  image?: string;
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
  benefits: ItemLanding[] = [
    {
      title: 'Sin compartir número de cuenta',
      image: 'icon-person-smile.svg',
      content:
        'Tus clientes podrán pagarte a través de "Pago de Servicios" en los canales digitales de Interbank y en más de 4,500 agentes.',
    },
    {
      title: 'Configura tus cobros',
      image: 'icon-laptop-configuration.svg',
      content:
        'Elige el orden de pago de las deudas, si recibirás pagos por partes o incluirás el cobro de moras.',
    },
    {
      title: 'Cobranzas al instante',
      image: 'icon-money-hand.svg',
      content:
        'Podrás identificar los pagos de cada cliente y ver el estado de pago en tiempo real.',
    },
    {
      title: 'Descarga reportes',
      image: 'icon-laptop-report.svg',
      content:
        'Para facilitar tu proceso de conciliación y seguimiento de cobranzas.',
    },
  ];
  howWorks: ItemLanding[] = [
    {
      title: 'Regístrate',
      position: '01',
      content:
        'Crea tu contraseña y configura los cobros de tu empresa.<br /><br /><span class="tw-text-sm">*Pronto podrás registrarte en Cobro Simple. Estamos trabajando en una nueva experiencia para ti.</span>',
    },
    {
      title: 'Ingresa y carga tu lista de clientes por cobrar',
      position: '02',
      content:
        'Ingresa a la plataforma con tu RUC y contraseña, luego carga tu lista de clientes en la sección “Agregar cobros”.',
    },
    {
      title: 'Empieza a recibir los pagos de tus clientes',
      position: '03',
      content:
        'Ellos podrán pagarte buscando el nombre de tu empresa en el módulo de servicios de APP Interbank Empresas, Interbank APP o Banca por internet (empresas o personas).',
    },
    {
      title: 'Identifica y concilia los pagos recibidos',
      position: '04',
      content:
        'Puedes ver en tiempo real desde la plataforma, quién te pagó y exportar reportes para analizar tus cobranzas.',
    },
  ];
  payments: ItemLanding[] = [
    {
      title: 'Pagos parciales',
      image: 'icon-money-cards.svg',
      content:
        'Configura si permitirás a tus clientes pagar su deuda total por partes.',
    },
    {
      title: 'Pagos sucesivos',
      image: 'icon-calendar.svg',
      content:
        'Podrás hacer que tus clientes paguen la deuda más antigua primero o la que ellos deseen.',
    },
    {
      title: 'Cobro de mora',
      image: 'icon-percent-more.svg',
      content:
        'Configura si deseas que tus clientes paguen una mora y define el importe de esta.',
    },
  ];
  disabledAffiliation$ = this.store.select(
    appConfigFeature.selectDisabledAffiliation
  );

  constructor(
    public router: Router,
    public dialogService: DialogService,
    private adobeAnalytics: AdobeAnalyticsService,
    private store: Store
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  clickRegistration(category: string, location: string, disabled = false) {
    if (!disabled) {
      void this.router.navigateByUrl(authFullRoutingNames.COMPANY_REGISTER, {
        state: { initNew: true },
      });
    }
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

  trackByiItems(_index: number, item: ItemLanding): string {
    return item.title;
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
