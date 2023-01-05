import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { authFullRoutingNames } from '../../auth-routing.names';
import {
  documentTypes,
  errorsRegisterForm,
  mobileOperators,
} from '../../constants';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-company-registration',
  templateUrl: './company-registration.page.html',
  styleUrls: ['./company-registration.page.scss'],
})
export class CompanyRegistrationPage implements OnInit {
  registerForm: UntypedFormGroup;
  errors = errorsRegisterForm;
  operators = mobileOperators;
  documentTypes = documentTypes;

  constructor(private router: Router, public affiliation: AffiliationService) {}

  ngOnInit() {
    this.registerForm = this.affiliation.registerForm;
  }

  onSubmit() {
    this.affiliation.validateCompany().subscribe(({ success }) => {
      if (success) {
        this.router.navigate([authFullRoutingNames.COMPANY_FILL_DATA]);
      }
    });
  }

  goBack() {
    this.router.navigate([authFullRoutingNames.LOGIN]);
  }
}
