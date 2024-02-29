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
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
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
    protected companyServices: CompanyServicesService,
    public serviceForms: ServicesFormsService,
    private logger: NGXLogger,
    protected tracking: TrackingService
  ) {}

  onSubmit() {
    this.companyServices.saveService().subscribe((result) => {
      this.logger.debug('-> result', result);
      void this.router.navigate([internalFullRoutingNames.SERVICES]);
    });
  }

  onCancel() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios agregar nuevo servicio',
      action: 'Click',
      detail: 'Cancelar agregar otro servicio',
      label: 'Cancelar',
      typeElement: 'Botón',
      location: 'Servicios agregar',
    });
    void this.router.navigate([internalFullRoutingNames.SERVICES]);
    this.serviceForms.resetServicesForms();
  }
}
