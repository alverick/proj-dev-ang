import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceStepInfoComponent } from '../../../../shared/components/service-step-info/service-step-info.component';
import { ServicesFormsService } from '../../../../shared/services';
import { type CompanyAccounts } from '../../../../shared/services/company.service';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorServiceInformation } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
  standalone: true,
  imports: [ServiceStepInfoComponent],
})
export class ServiceInfoPage implements OnInit {
  accounts: CompanyAccounts[];
  errors = errorServiceInformation;
  constructor(
    private readonly router: Router,
    public affiliation: AffiliationService,
    private readonly serviceForms: ServicesFormsService,
    private readonly tracking: TrackingService,
  ) {}

  ngOnInit() {
    this.affiliation?.getAccountsCompany()?.subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
  onSubmit() {
    const { useAgent } = this.affiliation.serviceForm.value;
    this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
      category: 'Registrate – Información de servicio',
      action: 'Click',
      label: 'Siguiente',
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
