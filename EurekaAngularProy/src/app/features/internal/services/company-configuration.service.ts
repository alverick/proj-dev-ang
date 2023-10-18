import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forEachObjIndexed, pick } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';
import { tap } from 'rxjs/operators';

import { IEntryModel } from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import {
  ModelFormGroup,
  SimpleModelFormGroup,
} from '../../../shared/models/forms';
import { CompanyService } from '../../../shared/services';
import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
  Metadata,
} from '../../../shared/services/adobe-analytics.service';
import { LoginService } from '../../../shared/services/login.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { MustDifferent } from '../../../shared/validators/must-different.validator';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { passwordValidators } from '../../../shared/validators/password-validators';
import { authFullRoutingNames } from '../../auth/auth-routing.names';
import { internalFullRoutingNames } from '../internal-routing.names';

export interface ChangePasswordForm {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface CompanyForm {
  ruc: string;
  name: string;
  entry: string;
  entrySelect: IEntryModel;
  email: string;
  movilNumber: string;
  movilOperator: string;
  documentType: string;
  documentNumber: string;
}

@Injectable()
export class CompanyConfigurationService {
  companyData: IDataEnterpriseModel;
  companyForm: SimpleModelFormGroup<CompanyForm>;
  passwordForm: ModelFormGroup<ChangePasswordForm>;
  entryOptions: IEntryModel[] = [];
  entryOptionsAdd: IEntryModel[] = [];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    protected loginService: LoginService,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {
    this.initForms();
  }

  setCompanyData() {
    this.companyForm.patchValue(this.companyData);
    if (
      this.companyData.newNameGTPStatus === 0 ||
      this.companyData.newNameGTPStatus === 2
    ) {
      this.companyForm.get('name').disable();
    }
    this.setCategory();
  }

  saveCompanyData() {
    const { email, movilNumber, movilOperator, name } = this.companyForm.value;
    const companyDataUpdated = {
      newName: name || this.companyData.name,
      email,
      movilNumber,
      movilOperator,
    };
    const enterprise = {
      ruc: this.companyData.ruc,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      ...companyDataUpdated,
    };

    const formValue = pick(
      ['email', 'movilNumber', ' movilOperator', 'name'],
      this.companyForm.value
    );
    const metadata: Metadata[] = [];
    forEachObjIndexed((value, key) => {
      metadata.push({
        key,
        value,
      });
    }, formValue);
    const actionStep: Partial<ActionEventProperties> = {
      category: 'Empresa',
      action: 'Click',
      label: 'Buscar',
      location: 'Empresa',
      step: 'Not available',
      state: 'Envío exitoso',
      metadata,
    };

    this.companyService
      .updateCompany(enterprise)
      .subscribe((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          this.adobeAnalytics.trackEvent(
            AdobeEvent.trackFormSubmit,
            actionStep
          );
          this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
            category: 'warning - icon',
            action: 'modal-view',
            detail: 'Los datos de la empresa han sido actualizados.',
            location: 'Modal',
          });
          void swalAlert
            .fire({
              text: 'Los datos de la empresa han sido actualizados.',
              showCloseButton: true,
              confirmButtonText: 'Aceptar',
            })
            .then((result) => {
              if (result.value) {
                void this.router.navigate([internalFullRoutingNames.HOME]);
              }
            });
        }
        if (enterpriseUpdate.success === false) {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intención de envío',
            typeError: 'Ha ocurrido un error con el servidor',
          });
          this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
            category: 'error - icon',
            action: 'modal-view',
            detail: 'Ha ocurrido un error',
            location: 'Modal',
          });
          void swalAlert.fire({
            icon: 'error',
            text: 'Ha ocurrido un error',
            showCloseButton: true,
            confirmButtonText: 'Aceptar',
          });
        }
      });
  }

  savePassword() {
    const { password, newPassword, confirmNewPassword } =
      this.passwordForm.value;
    const { email, movilNumber, movilOperator, name } = this.companyData;
    const companyDataUpdated = {
      newName: name,
      email,
      movilNumber,
      movilOperator,
    };
    const enterprise = {
      ruc: this.companyData.ruc,
      password,
      newPassword,
      confirmNewPassword,
      ...companyDataUpdated,
    };

    const actionStep: Partial<ActionEventProperties> = {
      category: 'Empresa',
      action: 'Click',
      label: 'Guardar',
      location: 'Empresa panel',
      step: 'Not available',
      state: 'Envío exitoso',
    };
    return this.companyService.updateCompany(enterprise).pipe(
      tap(({ success, message }) => {
        if (success === true) {
          this.adobeAnalytics.trackEvent(
            AdobeEvent.trackFormSubmit,
            actionStep
          );
          this.loginService.logout().subscribe(() => {
            this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
              category: 'warning - icon',
              action: 'modal-view',
              detail: 'Los datos de la empresa han sido actualizados',
              location: 'Modal',
            });
            void swalAlert
              .fire({
                title: 'Contraseña actualizada ',
                text: 'Inicie sesión con su nueva contraseña.',
                showCloseButton: true,
                confirmButtonText: 'Entendido',
              })
              .then(() => {
                void this.router.navigate([authFullRoutingNames.LOGIN]);
              });
          });
          this.passwordForm.reset();
        } else {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intención de envío',
            typeError: 'Ha ocurrido un error con el servidor.',
          });
          this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
            category: 'error - icon',
            action: 'modal-view',
            detail: message || 'Ha ocurrido un error en el servidor.',
            location: 'Modal',
          });
          void swalAlert.fire({
            icon: 'warning',
            text: message || 'Ha ocurrido un error en el servidor.',
            showCloseButton: true,
            confirmButtonText: 'Aceptar',
          });
        }
      })
    );
  }

  setCategory() {
    const entryControl = this.companyForm.get('entry');
    if (isNotEmpty(this.entryOptions) && isNotEmpty(entryControl.value)) {
      const entrySel = this.entryOptions.find(
        (entry) => entry.code === entryControl.value
      );
      this.companyForm.get('entrySelect').setValue(entrySel);
    }
  }

  private initForms() {
    this.companyForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      ruc: [{ value: '', disabled: true }],
      entry: [{ value: '', disabled: true }],
      entrySelect: [{ value: null as IEntryModel, disabled: true }],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      movilOperator: ['', [Validators.required]],
      movilNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
    });
    this.passwordForm = this.fb.nonNullable.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(25),
          ],
        ],
        newPassword: ['', passwordValidators],
        confirmNewPassword: ['', passwordValidators],
      },
      {
        validators: [
          MustMatch('newPassword', 'confirmNewPassword'),
          MustDifferent('password', 'newPassword'),
        ],
      }
    );
  }
}
