import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServicesFormsService } from '../../../../shared/services';
import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorServiceInformation } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  accounts;
  errors = errorServiceInformation;
  constructor(
    private router: Router,
    public affiliation: AffiliationService,
    private serviceForms: ServicesFormsService,
    private adobeAnalytics: AdobeAnalyticsService
  ) {}

  ngOnInit() {
    this.affiliation.getAccountsCompany().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
  onSubmit() {
    const { useAgent } = this.affiliation.serviceForm.value;
    this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
      category: 'Registrate – Información de servicio',
      action: 'Click',
      label: 'Siguiente',
      module: 'Afiliación',
      location: 'Registrate',
      step: 'Step3',
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
      authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
    ]);
  }

  onCancel() {
    this.serviceForms.resetServicesForms();
    void this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST]);
  }
}
