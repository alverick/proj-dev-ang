import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServicesFormsService } from '../../../../shared/services';
import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { CompanyAccounts } from '../../../../shared/services/company.service';
import { errorServiceInformation } from '../../constants';
import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage {
  accounts: CompanyAccounts[];
  errors = errorServiceInformation;
  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public serviceForms: ServicesFormsService,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {
    this.activatedRoute.data.subscribe((value: any) => {
      this.accounts = value.accounts as CompanyAccounts[];
    });
  }

  onSubmit() {
    const { useAgent } = this.serviceForms.serviceForm.value;
    this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
      category: 'Servicios agregar nuevo servicio',
      action: 'Click',
      label: 'Siguiente',
      location: 'Servicios agregar',
      step: 'Step1',
      state: 'Envío exitoso',
      metadata: [
        {
          key: 'Canales Digitales',
          value: 'true',
        },
        {
          key: 'Agentes',
          value: useAgent ? 'true' : 'false',
        },
      ],
    });
    void this.router.navigate([
      internalFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
    ]);
  }

  onCancel() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios agregar nuevo servicio',
      action: 'Click',
      detail: 'Cancelar agregar otro servicio',
      label: 'Cancelar',
      typeElement: 'Botón',
      location: 'Servicios agregar',
    });
    this.serviceForms.resetServicesForms();
    void this.router.navigate([internalFullRoutingNames.SERVICES]);
  }
}
