import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationService } from '../../services/affiliation.service';

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
  constructor(private router: Router, public affiliation: AffiliationService) {}

  onSubmit() {
    this.affiliation.saveService();
    this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST]);
  }
}
