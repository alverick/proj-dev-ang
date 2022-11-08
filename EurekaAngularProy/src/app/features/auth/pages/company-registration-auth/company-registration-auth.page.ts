import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEntryModel } from 'src/app/shared/models';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../../auth-routing.names';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-company-registration-auth',
  templateUrl: './company-registration-auth.page.html',
  styleUrls: ['./company-registration-auth.page.scss'],
})
export class CompanyRegistrationAuthPage implements OnInit {
  entryOptions: IEntryModel[] = [];

  constructor(public affiliation: AffiliationService, private router: Router) {}

  ngOnInit() {
    this.affiliation
      .getEntryOptions()
      .subscribe((result) => (this.entryOptions = result));
  }

  goBack() {
    this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
  }

  onSubmit() {
    this.affiliation.saveCompany().subscribe(({ success }) => {
      if (success) {
        this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_INFO]);
      }
    });
  }
}
