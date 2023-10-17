import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import { IEntryModel } from '../../../../shared/models';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { ModelFormGroup } from '../../../../shared/models/forms';
import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
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
  blurContent = false;

  constructor(
    public companyConfiguration: CompanyConfigurationService,
    private activatedRoute: ActivatedRoute,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {}

  ngOnInit() {
    (
      this.activatedRoute.data as Observable<{
        company: IDataEnterpriseModel;
        entries: IEntryModel[];
      }>
    ).subscribe(({ company, entries }) => {
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
      this.blurContent = true;
    });
  }
  onShowPanel() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
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
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
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
