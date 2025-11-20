import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { ServiceStepConfigurationComponent } from '../../../../shared/components/service-step-configuration/service-step-configuration.component';
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
  standalone: true,
  imports: [ServiceStepConfigurationComponent],
})
export class ServiceConfigurationPage {
  private readonly router = inject(Router);
  protected companyServices = inject(CompanyServicesService);
  serviceForms = inject(ServicesFormsService);
  private readonly logger = inject(NGXLogger);
  protected tracking = inject(TrackingService);

  errorMessagesServiceConfig = errorServiceConfiguration;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  blockAction = false;

  onSubmit() {
    if (!this.blockAction) {
      this.blockAction = true;
      this.companyServices.saveService().subscribe({
        next: (result) => {
          this.logger.debug('-> result', result);
          this.blockAction = false;
          void this.router.navigate([internalFullRoutingNames.SERVICES]);
        },
        error: () => {
          this.blockAction = false;
        },
      });
    }
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
