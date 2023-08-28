import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { map } from 'rxjs/operators';

import { authFullRoutingChildNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-add',
  templateUrl: './service-add.page.html',
  styleUrls: ['./service-add.page.scss'],
})
export class ServiceAddPage {
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }];

  constructor(private router: Router, public affiliation: AffiliationService) {
    router.events
      .pipe(map((evt) => (evt instanceof Scroll ? evt.routerEvent : evt)))
      .subscribe((val: RouterEvent) => {
        if (val instanceof NavigationEnd) {
          switch (val.url) {
            case authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
              this.position = 1;
              break;
            case authFullRoutingChildNames.SERVICES_ADD_INFO:
              this.position = 0;
              break;
            case authFullRoutingChildNames.SERVICES_ADD_LIST:
            default:
              this.position = 2;
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
    event.returnValue = false;
  }
}
