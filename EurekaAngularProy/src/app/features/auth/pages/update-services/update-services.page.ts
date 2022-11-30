import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../../auth-routing.names';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorMessagesService,
  errorMessagesServiceConfig,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationFormsService, AffiliationService } from '../../services';

@Component({
  selector: 'cs-update-services',
  templateUrl: './update-services.page.html',
  styleUrls: ['./update-services.page.scss'],
})
export class UpdateServicesPage implements OnInit {
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];
  showSidebar = false;
  errorMessages = {
    ...errorMessagesServiceConfig,
    ...errorMessagesService,
  };
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  formData;

  constructor(
    private router: Router,
    private affiliationForms: AffiliationFormsService,
    public affiliation: AffiliationService
  ) {}

  ngOnInit() {}

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
    this.affiliation.updateEditService(this.position, true);
    this.showSidebar = false;
  }

  closePanel() {
    this.affiliation.removeEditService();
  }
}
