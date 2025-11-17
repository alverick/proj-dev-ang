
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';

import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { ServiceEditFormComponent } from '../../../../shared/components/service-edit-form/service-edit-form.component';
import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
import { ServicesFormsService } from '../../../../shared/services';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../../auth-routing.names';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  errorServiceInformation,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationService } from '../../services';

@Component({
    host: { class: 'tw-w-full' },
    selector: 'cs-service-resume',
    templateUrl: './service-resume.page.html',
    standalone: true,
    imports: [
    ServicesListComponent,
    ServiceCardComponent,
    SidebarModule,
    ServiceEditFormComponent
]
})
export class ServiceResumePage {
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
  form = this.affiliation.editServiceForm;

  constructor(
    private readonly router: Router,
    private readonly serviceForms: ServicesFormsService,
    public affiliation: AffiliationService,
  ) {}

  actionDelete(position: number) {
    void swalAlert
      .fire({
        text: '¿Estás seguro que deseas eliminar este servicio?',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
      })
      .then(({ value }) => {
        if (value) {
          this.affiliation.deleteService(position);
        }
      });
  }

  actionEdit(position: number) {
    this.formData = this.affiliation.setEditForm(position);
    this.position = position;
    setTimeout(() => {
      this.showSidebar = true;
    }, 200);
  }

  createService() {
    this.serviceForms.resetServicesForms();
    void this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_INFO], {
      state: { navigateValid: true },
    });
  }

  finalize() {
    this.affiliation.saveAllServices().subscribe(() => {
      void this.router.navigate([authFullRoutingNames.REGISTRATION_FINISHED]);
    });
  }

  updateService() {
    this.affiliation.updateEditService(this.position);
    this.showSidebar = false;
  }

  closePanel() {
    this.affiliation.removeEditService();
  }
}
