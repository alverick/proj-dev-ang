import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import {
  errorServiceConfiguration,
  errorServiceInformation,
} from '../../../../shared/constants/company-errors';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../../shared/constants/services';
import { ServicesFormsService } from '../../../../shared/services';
import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { internalFullRoutingChildNames } from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

@Component({
  host: { class: 'tw-w-full' },
  selector: 'cs-company-services',
  templateUrl: './company-services.page.html',
  styleUrls: ['./company-services.page.scss'],
})
export class CompanyServicesPage {
  showSidebar = false;
  position: number;
  errorMessages = {
    ...errorServiceConfiguration,
    ...errorServiceInformation,
  };
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  formData;
  loadFormEdit = false;

  constructor(
    public companyServices: CompanyServicesService,
    private serviceForms: ServicesFormsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private logger: NGXLogger,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {
    this.logger.debug(
      '-> this.companyServicesService.services',
      this.companyServices.services
    );
    this.activatedRoute.data.subscribe((value: any) => {
      this.companyServices.services = value.services;
    });
  }

  actionDelete(position: number) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios',
      action: 'Click',
      detail: 'Eliminar servicio',
      label: 'Eliminar',
      typeElement: 'Botón',
      location: 'Service card',
    });
    this.companyServices.canDelete(position).subscribe((result) => {
      const title = '¿Estás seguro que deseas eliminar este servicio?';
      let text =
        'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio.';
      if (result.hasPayed) {
        text =
          'Ya existe un historial de pagos realizados con este servicio, solo se eliminarán las ' +
          'deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
      }
      this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
        category: title,
        action: 'modal-view',
        detail: text,
        location: 'Modal',
      });
      void swalAlert
        .fire({
          text,
          title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        })
        .then((confirm) => {
          if (confirm.value) {
            this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
              category: 'Servicios',
              action: 'Click',
              detail: 'Confirmar eliminación de servicio',
              label: 'Confirmar',
              typeElement: 'Botón',
              location: 'Modal',
            });
            this.companyServices.deleteService(position);
          } else {
            this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
              category: 'Servicios',
              action: 'Click',
              detail: 'Cancelar eliminación de servicio',
              label: 'Cancelar',
              typeElement: 'Botón',
              location: 'Modal',
            });
          }
        });
    });
  }
  actionEdit(position: number) {
    this.loadFormEdit = true;
    this.formData = this.companyServices.setEditForm(position);
    this.position = position;
    setTimeout(() => {
      this.showSidebar = true;
    }, 200);
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios',
      action: 'Click',
      detail: 'Editar servicio',
      label: 'Editar',
      typeElement: 'Botón',
      location: 'Service card',
    });
  }

  onClosePanel() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios',
      action: 'Click',
      detail: 'Cerrar panel editar servicio',
      label: 'Cerrar',
      typeElement: 'Botón',
      location: 'Panel',
    });
    this.loadFormEdit = false;
  }

  createService() {
    this.serviceForms.resetServicesForms();
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios',
      action: 'Click',
      detail: 'Agregar otro servicio',
      label: 'Agregar otro servicio',
      typeElement: 'Botón',
      location: 'Servicios',
    });
    void this.router.navigate([
      internalFullRoutingChildNames.SERVICES_ADD_INFO,
    ]);
  }

  updateService() {
    this.companyServices.updateEditService(this.position).subscribe(() => {
      this.companyServices.getServices().subscribe(() => {
        this.showSidebar = false;
      });
    });
  }
}
