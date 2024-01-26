import { type OnInit, Component } from '@angular/core';
import { type UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { type Observable } from 'rxjs';

import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import { type IEntryModel } from '../../../../shared/models';
import { type IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { type ModelFormGroup } from '../../../../shared/models/forms';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { CompanyConfigurationService } from '../../services';
import { type ChangePasswordForm } from '../../services/company-configuration.service';

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
    protected tracking: TrackingService
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
