import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesFormsService } from '../../../../shared/services';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorServiceInformation } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  accounts;
  errors = errorServiceInformation;
  constructor(
    private router: Router,
    public affiliation: AffiliationService,
    private serviceForms: ServicesFormsService
  ) {}

  ngOnInit() {
    this.affiliation.getAccountsCompany().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
  onSubmit() {
    this.router.navigate([
      authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
    ]);
  }

  onCancel() {
    this.serviceForms.resetServicesForms();
    this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST]);
  }
}
