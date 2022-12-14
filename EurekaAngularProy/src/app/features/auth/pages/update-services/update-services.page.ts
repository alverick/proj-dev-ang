import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  styleUrls: ['./update-services.page.scss'],
})
export class UpdateServicesPage {
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];
  showSidebar = false;
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

  constructor(private router: Router, public affiliation: AffiliationService) {}

  actionDelete(position: number) {
    swalAlert
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

  finalize() {
    this.affiliation.saveUpdateInformation().subscribe((result) => {
      if (result) {
        this.router.navigate([authFullRoutingNames.PROCESSING]);
      } else {
        this.router.navigate([authFullRoutingNames.LOGIN]);
      }
    });
  }

  updateService() {
    this.affiliation.updateEditServiceName(this.position);
    this.showSidebar = false;
  }

  closePanel() {
    this.affiliation.removeEditService();
  }
}
