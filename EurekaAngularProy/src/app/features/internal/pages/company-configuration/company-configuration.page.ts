import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  companyForm: FormGroup;
  passwordForm: FormGroup;
  errors = { ...errorsRegisterForm, ...errorRegisterAuth };
  operators = mobileOperators;
  documentTypes = documentTypes;
  submitted = false;
  errorsPassword = {
    ...errorRegisterAuth,
    newPassword: errorRegisterAuth.password,
    confirmNewPassword: errorRegisterAuth.passwordConfirm,
  };
  showSidebar = false;

  constructor(public companyConfiguration: CompanyConfigurationService) {}

  ngOnInit() {
    this.companyForm = this.companyConfiguration.companyForm;
    this.passwordForm = this.companyConfiguration.passwordForm;
  }
  onSendForm(event) {
    this.companyConfiguration.savePassword().subscribe(()=>{
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
