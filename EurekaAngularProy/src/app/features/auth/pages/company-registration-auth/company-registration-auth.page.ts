import { type OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { type IEntryModel } from '../../../../shared/models';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../../auth-routing.names';
import { errorRegisterAuth } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-company-registration-auth',
  templateUrl: './company-registration-auth.page.html',
  styleUrls: ['./company-registration-auth.page.scss'],
})
export class CompanyRegistrationAuthPage implements OnInit {
  entryOptions: IEntryModel[] = [];
  errors = errorRegisterAuth;

  constructor(public affiliation: AffiliationService, private router: Router) {}

  ngOnInit() {
    this.affiliation
      .getEntryOptions()
      ?.subscribe((result) => (this.entryOptions = result));
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
