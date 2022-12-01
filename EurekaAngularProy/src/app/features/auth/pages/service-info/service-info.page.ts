import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorServiceInformation } from '../../constants';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  accounts;
  errors = errorServiceInformation;
  constructor(private router: Router, public affiliation: AffiliationService) {}

  ngOnInit() {
    this.affiliation.getAccountsCompany().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
  onSubmit() {
    console.log('onSubmit', this.affiliation.serviceForm.value);
    this.router.navigate([
      authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
    ]);
  }
}
