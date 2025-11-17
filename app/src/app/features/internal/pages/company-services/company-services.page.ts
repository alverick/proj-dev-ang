
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { SidebarModule } from 'primeng/sidebar';

import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { ServiceEditFormComponent } from '../../../../shared/components/service-edit-form/service-edit-form.component';
import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
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
import type { IServiceRemoteModel } from '../../../../shared/models';
import { ServicesFormsService } from '../../../../shared/services';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { internalFullRoutingChildNames } from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

@Component({
    host: { class: 'tw-w-full' },
    selector: 'cs-company-services',
    templateUrl: './company-services.page.html',
    standalone: true,
    imports: [
    ServicesListComponent,
    ServiceCardComponent,
    SidebarModule,
    ServiceEditFormComponent
]
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
    private readonly serviceForms: ServicesFormsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly logger: NGXLogger,
    protected tracking: TrackingService,
  ) {
    this.logger.debug(
      '-> this.companyServicesService.services',
      this.companyServices.services,
    );
    this.activatedRoute.data.subscribe((value) => {
      this.companyServices.services =
        value.services as Partial<IServiceRemoteModel>[];
    });
  }

  actionDelete(position: number) {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
          'deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank.';
      }
      this.tracking.trackEvent(AdobeEvent.trackView, {
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
            this.tracking.trackEvent(AdobeEvent.trackAction, {
              category: 'Servicios',
              action: 'Click',
              detail: 'Confirmar eliminación de servicio',
              label: 'Confirmar',
              typeElement: 'Botón',
              location: 'Modal',
            });
            this.companyServices.deleteService(position);
          } else {
            this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Servicios',
      action: 'Click',
      detail: 'Editar servicio',
      label: 'Editar',
      typeElement: 'Botón',
      location: 'Service card',
    });
  }

  onClosePanel() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
