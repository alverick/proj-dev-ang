import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { isNotEmpty } from 'ramda-adjunct';
import { tap } from 'rxjs/operators';

import { IEntryModel } from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import { ModelFormGroup } from '../../../shared/models/forms';
import { CompanyService } from '../../../shared/services';
import { GoogleAnalytics } from '../../../shared/services/googleAnalytics.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { MustDifferent } from '../../../shared/validators/must-different.validator';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { passwordValidators } from '../../../shared/validators/password-validators';
import { internalFullRoutingNames } from '../internal-routing.names';

export interface ChangePasswordForm {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Injectable()
export class CompanyConfigurationService {
  companyData: IDataEnterpriseModel;
  companyForm: UntypedFormGroup;
  passwordForm: ModelFormGroup<ChangePasswordForm>;
  entryOptions: IEntryModel[] = [];
  entryOptionsAdd: IEntryModel[] = [];
  constructor(
    private fb: UntypedFormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private gaService: GoogleAnalytics
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
    this.companyService
      .updateCompany(enterprise)
      .subscribe((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          this.gaService.sendEvent('ActualizaDatosEmpresa', {
            event_category: GoogleAnalytics.Dashboard,
            event_label: 'actualiza_datos_empresa',
          });
          void swalAlert
            .fire({
              text: 'Los datos de la empresa han sido actualizados',
              showCloseButton: true,
              confirmButtonText: 'ACEPTAR',
            })
            .then((result) => {
              if (result.value) {
                void this.router.navigate([internalFullRoutingNames.HOME]);
              }
            });
        }
        if (enterpriseUpdate.success === false) {
          void swalAlert.fire({
            icon: 'error',
            text: 'Ha ocurrido un error',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
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
    return this.companyService.updateCompany(enterprise).pipe(
      tap((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          void swalAlert.fire({
            text: 'Los datos de la empresa han sido actualizados',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
          });
        }
        if (enterpriseUpdate.success === false) {
          void swalAlert.fire({
            icon: 'warning',
            text: 'La contraseña no coincide con la contraseña actual',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
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
      entrySelect: [{ value: '', disabled: true }],
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
            Validators.maxLength(20),
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
