import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forEachObjIndexed, pick } from 'ramda';
import { tap } from 'rxjs/operators';

import { emailRegex } from '../../../shared/constants/patterns';
import {
  CompanyChangePasswordForm,
  CompanyForm,
} from '../../../shared/models/company-forms';
import { type IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import {
  type ModelFormGroup,
  type SimpleModelFormGroup,
} from '../../../shared/models/forms';
import { CompanyService } from '../../../shared/services';
import { ICompanyResult } from '../../../shared/services/company.service';
import { LoginService } from '../../../shared/services/login.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  type Metadata,
  TrackingService,
} from '../../../shared/services/tracking.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { MustDifferent } from '../../../shared/validators/must-different.validator';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { passwordValidators } from '../../../shared/validators/password-validators';
import { authFullRoutingNames } from '../../auth/auth-routing.names';
import { internalFullRoutingNames } from '../internal-routing.names';

@Injectable()
export class CompanyConfigurationService {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);
  protected loginService = inject(LoginService);
  protected tracking = inject(TrackingService);

  companyData: IDataEnterpriseModel;
  companyForm: SimpleModelFormGroup<CompanyForm>;
  passwordForm: ModelFormGroup<CompanyChangePasswordForm>;

  constructor() {
    this.initForms();
  }

  setCompanyData() {
    this.companyForm.patchValue(this.companyData);
    this.companyForm.get('name').disable();
  }

  saveCompanyData() {
    const { email, movilNumber, movilOperator } = this.companyForm.value;
    const companyDataUpdated = {
      email,
      movilNumber,
      movilOperator,
    };

    const formValue = pick(
      ['email', 'movilNumber', 'movilOperator'],
      this.companyForm.value,
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
      .updateCompany(companyDataUpdated)
      .subscribe((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
          this.tracking.trackEvent(AdobeEvent.trackView, {
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
            .then(() => {
              void this.router.navigate([internalFullRoutingNames.HOME]);
            });
        }
        if (enterpriseUpdate.success === false) {
          this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intención de envío',
            typeError: 'Ha ocurrido un error con el servidor',
          });
          this.tracking.trackEvent(AdobeEvent.trackView, {
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
    const actionStep: Partial<ActionEventProperties> = {
      category: 'Empresa',
      action: 'Click',
      label: 'Guardar',
      location: 'Empresa panel',
      step: 'Not available',
      state: 'Envío exitoso',
    };
    return this.companyService
      .updateCompanyPassword(
        this.passwordForm.value as CompanyChangePasswordForm,
      )
      .pipe(
        tap((response) => {
          this.handleSuccessResponse(response, actionStep);
        }),
      );
  }

  private handleSuccessResponse(
    response: ICompanyResult,
    actionStep: Partial<ActionEventProperties>,
  ) {
    if (response.success === true) {
      this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
      this.loginService.logout().subscribe(() => {
        this.tracking.trackEvent(AdobeEvent.trackView, {
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
      this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
        ...actionStep,
        state: 'Intención de envío',
        typeError: 'Ha ocurrido un error con el servidor.',
      });
      this.tracking.trackEvent(AdobeEvent.trackView, {
        category: 'error - icon',
        action: 'modal-view',
        detail: response.message || 'Ha ocurrido un error en el servidor.',
        location: 'Modal',
      });
      void swalAlert.fire({
        icon: 'warning',
        text: response.message || 'Ha ocurrido un error en el servidor.',
        showCloseButton: true,
        confirmButtonText: 'Aceptar',
      });
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
      entryName: [{ value: '', disabled: true }],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(emailRegex),
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
      },
    );
  }
}
