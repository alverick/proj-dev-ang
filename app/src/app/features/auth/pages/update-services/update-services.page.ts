
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { StepsModule } from 'primeng/steps';

import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { ServiceEditFormComponent } from '../../../../shared/components/service-edit-form/service-edit-form.component';
import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../../auth-routing.names';
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
    selector: 'cs-update-services',
    templateUrl: './update-services.page.html',
    standalone: true,
    imports: [
    StepsModule,
    ServicesListComponent,
    ServiceCardComponent,
    SidebarModule,
    ServiceEditFormComponent
]
})
export class UpdateServicesPage {
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];
  showSidebar = false;
  loadFormEdit = false;
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

  constructor(
    private readonly router: Router,
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
    this.loadFormEdit = true;
    this.formData = this.affiliation.setEditForm(position);
    this.position = position;
    setTimeout(() => {
      this.showSidebar = true;
    }, 200);
  }

  finalize() {
    this.affiliation.saveUpdateInformation().subscribe({
      next: (result) => {
        const route = result
          ? authFullRoutingNames.PROCESSING
          : authFullRoutingNames.LOGIN;
        void this.router.navigate([route]);
      },
      error: (error) => {
        console.error('Error finalizing:', error);
        void this.router.navigate([authFullRoutingNames.LOGIN]);
      },
    });
  }

  updateService() {
    this.showSidebar = false;
    this.affiliation.updateEditServiceName(this.position);
    this.loadFormEdit = false;
  }

  closePanel() {
    this.loadFormEdit = false;
    this.affiliation.removeEditService();
  }
}
