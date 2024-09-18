import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ServicesFormsService } from '../../../../shared/services';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-configuration',
  templateUrl: './service-configuration.page.html',
  styleUrls: ['./service-configuration.page.scss'],
})
export class ServiceConfigurationPage {
  errorMessagesServiceConfig = errorServiceConfiguration;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  blockAction = false;

  constructor(
    private router: Router,
    public affiliation: AffiliationService,
    private serviceForms: ServicesFormsService
  ) {}

  onSubmit() {
    if (!this.blockAction) {
      this.affiliation.saveService();
      void this.router
        .navigate([authFullRoutingChildNames.SERVICES_ADD_LIST])
        .then(() => {
          this.blockAction = true;
        });
    }
  }

  onCancel() {
    this.serviceForms.resetServicesForms();
    void this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST]);
  }
}
