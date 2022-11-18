import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../../auth-routing.names';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorMessagesService,
  errorMessagesServiceConfig,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationFormsService } from '../../services';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-resume',
  templateUrl: './service-resume.page.html',
  styleUrls: ['./service-resume.page.scss'],
})
export class ServiceResumePage implements OnInit {
  showSidebar = false;
  position: number;
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

  createService() {
    this.affiliationForms.resetServicesForms();
    this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_INFO], {
      state: { navigateValid: true },
    });
  }

  finalize() {
    this.affiliation.saveAllServices().subscribe(() => {
      this.router.navigate([authFullRoutingNames.REGISTRATION_FINISHED]);
    });
  }

  updateService(data) {
    this.affiliation.updateService(this.position, data);
    this.showSidebar = false;
  }
}
