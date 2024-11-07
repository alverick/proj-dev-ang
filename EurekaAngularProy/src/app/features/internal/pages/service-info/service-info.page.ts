import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceStepInfoComponent } from '../../../../shared/components/service-step-info/service-step-info.component';
import { ServicesFormsService } from '../../../../shared/services';
import { type CompanyAccounts } from '../../../../shared/services/company.service';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { errorServiceInformation } from '../../constants';
import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
  standalone: true,
  imports: [ServiceStepInfoComponent],
})
export class ServiceInfoPage {
  accounts: CompanyAccounts[];
  errors = errorServiceInformation;
  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public serviceForms: ServicesFormsService,
    protected tracking: TrackingService,
  ) {
    this.activatedRoute.data.subscribe((value: any) => {
      this.accounts = value.accounts as CompanyAccounts[];
    });
  }

  onSubmit() {
    const { useAgent } = this.serviceForms.serviceForm.value;
    this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
