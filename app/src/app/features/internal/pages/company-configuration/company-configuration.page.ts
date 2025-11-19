import { CommonModule, NgClass } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { type Observable } from 'rxjs';

import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import {
  CompanyChangePasswordForm,
  CompanyForm,
} from '../../../../shared/models/company-forms';
import { type IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import {
  type ModelFormGroup,
  type SimpleModelFormGroup,
} from '../../../../shared/models/forms';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { CompanyPasswordFormComponent } from '../../components/company-password-form/company-password-form.component';
import { CompanyUpdateFormComponent } from '../../components/company-update-form/company-update-form.component';
import { CompanyConfigurationService } from '../../services';

@Component({
  selector: 'cs-company-configuration',
  templateUrl: './company-configuration.page.html',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    CompanyUpdateFormComponent,
    CompanyPasswordFormComponent,
    Drawer,
  ],
})
export class CompanyConfigurationPage implements OnInit {
  companyForm: SimpleModelFormGroup<CompanyForm>;
  passwordForm: ModelFormGroup<CompanyChangePasswordForm>;
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
  blurContent = false;

  constructor(
    public companyConfiguration: CompanyConfigurationService,
    private readonly activatedRoute: ActivatedRoute,
    protected tracking: TrackingService,
  ) {}

  ngOnInit() {
    (
      this.activatedRoute.data as Observable<{
        company: IDataEnterpriseModel;
      }>
    ).subscribe(({ company }) => {
      this.companyConfiguration.companyData = company;
      this.isInReview =
        company.newNameGTPStatus === 0 || company.newNameGTPStatus === 2;
      this.companyConfiguration.setCompanyData();
    });
    this.companyForm = this.companyConfiguration.companyForm;
    this.passwordForm = this.companyConfiguration.passwordForm;
  }
  onSendForm() {
    this.companyConfiguration.savePassword().subscribe(({ success }) => {
      this.showSidebar = false;
      if (success) {
        this.blurContent = true;
      }
    });
  }
  onShowPanel() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Empresa',
      action: 'Click',
      detail: 'Cambiar contraseña abrir panel',
      label: 'Cambiar contraseña',
      typeElement: 'Link',
      location: 'Empresa',
    });
    this.passwordForm.reset();
    this.showSidebar = true;
  }

  closePanel() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Empresa',
      action: 'Click',
      detail: 'Cambiar contraseña cerrar panel',
      label: 'Cerrar panel',
      typeElement: 'Botón',
      location: 'Empresa',
    });
    this.passwordForm.reset();
  }

  saveInfo() {
    this.submitted = true;
    if (this.companyForm.valid) {
      this.companyConfiguration.saveCompanyData();
    }
  }
}
