import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
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
  position = 3;
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
    this.affiliation.setEditForm(position);
    this.position = position;
    this.showSidebar = true;
  }

  updateService($event: object) {}
}
