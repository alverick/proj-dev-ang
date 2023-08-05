import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import { ModelFormGroup } from '../../../../shared/models/forms';
import { CompanyConfigurationService } from '../../services';
import { ChangePasswordForm } from '../../services/company-configuration.service';

@Component({
  selector: 'cs-company-configuration',
  templateUrl: './company-configuration.page.html',
  styleUrls: ['./company-configuration.page.scss'],
})
export class CompanyConfigurationPage implements OnInit {
  companyForm: UntypedFormGroup;
  passwordForm: ModelFormGroup<ChangePasswordForm>;
  errors = { ...errorsRegisterForm, ...errorRegisterAuth };
  operators = mobileOperators;
  documentTypes = documentTypes;
  submitted = false;
  isInReview = false;
  errorsPassword = {
    ...errorRegisterAuth,
    newPassword: errorRegisterAuth.newPassword,
    confirmNewPassword: errorRegisterAuth.passwordConfirm,
  };
  showSidebar = false;

  constructor(
    public companyConfiguration: CompanyConfigurationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ company, entries }: any) => {
      this.companyConfiguration.entryOptions = entries;
      this.companyConfiguration.companyData = company;
      this.isInReview =
        company.newNameGTPStatus === 0 || company.newNameGTPStatus === 2;
      this.companyConfiguration.setCompanyData();
    });
    this.companyForm = this.companyConfiguration.companyForm;
    this.passwordForm = this.companyConfiguration.passwordForm;
  }
  onSendForm() {
    this.companyConfiguration.savePassword().subscribe(() => {
      this.showSidebar = false;
    });
  }
  onShowPanel() {
    this.passwordForm.reset();
    this.showSidebar = true;
  }

  closePanel() {
    this.passwordForm.reset();
  }

  saveInfo() {
    this.submitted = true;
    if (this.companyForm.valid) {
      this.companyConfiguration.saveCompanyData();
    }
  }
}
