import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
  constructor(private router: Router) {
    router.events.subscribe((val: any) => {
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
