import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../../shared/constants/services';
import { ServicesFormsService } from '../../../../shared/services';
import { errorServiceConfiguration } from '../../constants';
import { internalFullRoutingNames } from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

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
  constructor(
    private router: Router,
    private companyServices: CompanyServicesService,
    public serviceForms: ServicesFormsService,
    private logger: NGXLogger
  ) {}

  onSubmit() {
    this.companyServices.saveService().subscribe((result) => {
      this.logger.debug('-> result', result);
      this.router.navigate([internalFullRoutingNames.SERVICES]);
    });
  }

  onCancel() {
    this.serviceForms.resetServicesForms();
    this.router.navigate([internalFullRoutingNames.SERVICES]);
  }
}
