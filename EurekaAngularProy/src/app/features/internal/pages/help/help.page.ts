import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  activeIndex: number;
  constructor(private router: Router) {}

  goBack() {
    void this.router.navigate([internalFullRoutingNames.HOME]);
  }
}
