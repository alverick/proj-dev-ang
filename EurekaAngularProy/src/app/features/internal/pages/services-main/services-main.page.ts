import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { map } from 'rxjs/operators';

import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-services-main',
  templateUrl: './services-main.page.html',
  styleUrls: ['./services-main.page.scss'],
})
export class ServicesMainPage {
  position = 2;
  constructor(protected router: Router) {
    router.events
      .pipe(map((evt) => (evt instanceof Scroll ? evt.routerEvent : evt)))
      .subscribe((val: RouterEvent) => {
        if (val instanceof NavigationEnd) {
          switch (val.url) {
            case internalFullRoutingChildNames.SERVICES_ADD_INFO:
              this.position = 0;
              break;
            case internalFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
              this.position = 1;
              break;
            case internalFullRoutingNames.SERVICES:
            default:
              this.position = 2;
              break;
          }
        }
      });
  }
}
