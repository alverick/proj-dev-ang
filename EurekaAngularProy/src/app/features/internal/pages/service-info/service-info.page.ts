import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesFormsService } from '../../../../shared/services';
import { errorServiceInformation } from '../../constants';
import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage {
  accounts;
  errors = errorServiceInformation;
  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public serviceForms: ServicesFormsService
  ) {
    this.activatedRoute.data.subscribe((value: any) => {
      this.accounts = value.accounts;
    });
  }

  onSubmit() {
    this.router.navigate([
      internalFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
    ]);
  }

  onCancel() {
    this.serviceForms.resetServicesForms();
    this.router.navigate([internalFullRoutingNames.SERVICES]);
  }
}
