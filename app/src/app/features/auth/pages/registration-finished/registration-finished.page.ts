import { Component, type OnInit } from '@angular/core';

import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-registration-finished',
  templateUrl: './registration-finished.page.html',
  standalone: true,
  imports: [],
})
export class RegistrationFinishedPage implements OnInit {
  email = '';
  constructor(public affiliation: AffiliationService) {}

  ngOnInit() {
    this.email = this.affiliation.email;
  }
}
