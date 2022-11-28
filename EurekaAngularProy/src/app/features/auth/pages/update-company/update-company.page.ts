import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEntryModel } from '../../../../shared/models';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorMessagesAuth } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-update-company',
  templateUrl: './update-company.page.html',
  styleUrls: ['./update-company.page.scss'],
})
export class UpdateCompanyPage implements OnInit {
  entryOptions: IEntryModel[] = [];
  errors = errorMessagesAuth;

  constructor(private router: Router, public affiliation: AffiliationService) {}

  ngOnInit() {
    this.affiliation
      .getEntryOptions()
      .subscribe((result) => (this.entryOptions = result));
  }

  onSubmit() {
    this.router.navigate([authFullRoutingChildNames.UPDATE_SERVICES]);
  }
}
