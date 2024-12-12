import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { type IEntryModel } from '../../../../shared/models';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../../auth-routing.names';
import { CompanyFormAuthComponent } from '../../components/company-form-auth/company-form-auth.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { errorRegisterAuth } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-company-registration-auth',
  templateUrl: './company-registration-auth.page.html',
  styleUrls: ['./company-registration-auth.page.scss'],
  standalone: true,
  imports: [SidebarCompanyComponent, CompanyFormAuthComponent],
})
export class CompanyRegistrationAuthPage implements OnInit {
  entryOptions: IEntryModel[] = [];
  errors = errorRegisterAuth;
  blockAction = false;

  constructor(
    public affiliation: AffiliationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.affiliation
      .getEntryOptions()
      ?.subscribe((result) => (this.entryOptions = result));
  }

  goBack() {
    void this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
  }

  onSubmit() {
    if (!this.blockAction) {
      this.blockAction = true;
      this.affiliation.saveCompany().subscribe({
        next: ({ success }) => {
          this.blockAction = false;
          if (success) {
            void this.router.navigate([
              authFullRoutingChildNames.SERVICES_ADD_INFO,
            ]);
          }
        },
        error: () => {
          this.blockAction = false;
        },
        complete: () => {
          this.blockAction = false;
        },
      });
    }
  }
}
