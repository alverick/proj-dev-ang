import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-add',
  templateUrl: './service-add.page.html',
  styleUrls: ['./service-add.page.scss'],
})
export class ServiceAddPage {
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];
  constructor(private router: Router, public affiliation: AffiliationService) {
    router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        switch (val.url) {
          case authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
            this.position = 1;
            break;
          case authFullRoutingChildNames.SERVICES_ADD_LIST:
            this.position = 2;
            break;
          case authFullRoutingChildNames.SERVICES_ADD_INFO:
          default:
            this.position = 0;
            break;
        }
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    confirm(
      'El registro de tu empresa no ha concluido, si sales ahora los cambios se perderán.'
    );
    event.returnValue = false; // stay on same page
  }
}
