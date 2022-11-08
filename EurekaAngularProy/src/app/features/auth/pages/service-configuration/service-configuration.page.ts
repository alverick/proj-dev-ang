import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-service-configuration',
  templateUrl: './service-configuration.page.html',
  styleUrls: ['./service-configuration.page.scss'],
})
export class ServiceConfigurationPage {
  constructor(private router: Router, public affiliation: AffiliationService) {}

  onSubmit() {
    this.affiliation.saveService();
    this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST]);
  }
}
