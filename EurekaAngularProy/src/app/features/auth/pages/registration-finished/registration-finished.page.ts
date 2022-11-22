import { Component, OnInit } from '@angular/core';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-registration-finished',
  templateUrl: './registration-finished.page.html',
  styleUrls: ['./registration-finished.page.scss'],
})
export class RegistrationFinishedPage implements OnInit {
  email = '';
  constructor(public affiliation: AffiliationService) {}

  ngOnInit() {
    this.email = this.email;
  }
}
