import { Component, inject, type OnInit } from '@angular/core';
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
  standalone: true,
  imports: [SidebarCompanyComponent, CompanyFormAuthComponent],
})
export class UpdateCompanyPage implements OnInit {
  private readonly router = inject(Router);
  affiliation = inject(AffiliationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  entryOptions: IEntryModel[] = [];
  errors = errorRegisterAuth;

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
