import { Component, type OnInit } from '@angular/core';
import { type UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { pathEq } from 'ramda';

import { authFullRoutingNames } from '../../auth-routing.names';
import { CompanyFormRegistrationComponent } from '../../components/company-form-registration/company-form-registration.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import {
  documentTypes,
  errorsRegisterForm,
  mobileOperators,
} from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-company-registration',
  templateUrl: './company-registration.page.html',
  styleUrls: ['./company-registration.page.scss'],
  standalone: true,
  imports: [SidebarCompanyComponent, CompanyFormRegistrationComponent],
})
export class CompanyRegistrationPage implements OnInit {
  registerForm: UntypedFormGroup;
  errors = errorsRegisterForm;
  operators = mobileOperators;
  documentTypes = documentTypes;

  constructor(
    private router: Router,
    public affiliation: AffiliationService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (pathEq(true, ['extras', 'state', 'initNew'], navigation)) {
      this.affiliation.registerForm.get('email').setValue('');
      this.affiliation.resetRegistration();
    }
  }

  ngOnInit() {
    this.registerForm = this.affiliation.registerForm;
  }

  onSubmit() {
    this.affiliation.validateCompany().subscribe(({ success }) => {
      if (success) {
        void this.router.navigate([authFullRoutingNames.COMPANY_FILL_DATA]);
      }
    });
  }
}
