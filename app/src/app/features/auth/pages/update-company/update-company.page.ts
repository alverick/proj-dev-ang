import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { type IEntryModel } from '../../../../shared/models';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { CompanyFormAuthComponent } from '../../components/company-form-auth/company-form-auth.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { errorRegisterAuth } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
    selector: 'cs-update-company',
    templateUrl: './update-company.page.html',
    imports: [SidebarCompanyComponent, CompanyFormAuthComponent]
})
export class UpdateCompanyPage implements OnInit {
  entryOptions: IEntryModel[] = [];
  errors = errorRegisterAuth;

  constructor(
    private readonly router: Router,
    public affiliation: AffiliationService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute?.data?.subscribe(
      ({ entries }: { entries: IEntryModel[] }) => {
        this.entryOptions = entries;
      },
    );
  }

  onSubmit() {
    void this.router.navigate([authFullRoutingChildNames.UPDATE_SERVICES]);
  }
}
