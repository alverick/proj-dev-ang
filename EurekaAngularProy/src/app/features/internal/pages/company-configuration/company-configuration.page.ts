import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorsRegisterForm,
  errorRegisterAuth,
} from '../../../../shared/constants/company-errors';
import { CompanyConfigurationService } from '../../services';

@Component({
  selector: 'cs-company-configuration',
  templateUrl: './company-configuration.page.html',
  styleUrls: ['./company-configuration.page.scss'],
})
export class CompanyConfigurationPage implements OnInit {
  companyForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  errors = { ...errorsRegisterForm, ...errorRegisterAuth };
  operators = mobileOperators;
  documentTypes = documentTypes;
  submitted = false;
  nameInReview = false;
  errorsPassword = {
    ...errorRegisterAuth,
    newPassword: errorRegisterAuth.password,
    confirmNewPassword: errorRegisterAuth.passwordConfirm,
  };
  showSidebar = false;

  constructor(
    public companyConfiguration: CompanyConfigurationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ company, entries }: any) => {
      this.companyConfiguration.entryOptions = entries;
      this.companyConfiguration.companyData = company;
      this.nameInReview =
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
