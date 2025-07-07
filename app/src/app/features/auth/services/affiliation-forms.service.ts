import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { type IEntryModel } from '../../../shared/models';
import {
  type ModelFormGroup,
  type SimpleModelFormGroup,
} from '../../../shared/models/forms';
import {
  authNameValidators,
  emailValidators,
  mobileValidators,
  rucValidatorsComplete,
} from '../../../shared/validators/company-validators';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { nameInvalid } from '../../../shared/validators/name-invalid.validator';
import { passwordValidators } from '../../../shared/validators/password-validators';

export interface CompanyName {
  label: string;
  value: string;
  description: string;
}

export interface RegisterForm {
  documentType: string;
  documentNumber: string;
  ruc: string;
  email: string;
  emailConfirm: string;
  movilNumber: string;
  movilOperator: string;
}

export type AuthForm = {
  ruc: string;
  name: string;
  nameSelect: string;
  entry: string;
  entrySelect: IEntryModel;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
};

@Injectable()
export class AffiliationFormsService {
  registerForm: ModelFormGroup<RegisterForm>;
  authForm: SimpleModelFormGroup<AuthForm>;

  constructor(private readonly formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group(
      {
        documentType: ['', [Validators.required]],
        documentNumber: ['', [Validators.required]],
        ruc: ['', rucValidatorsComplete],
        email: ['', emailValidators],
        emailConfirm: ['', [Validators.required]],
        movilNumber: ['', mobileValidators],
        movilOperator: ['', [Validators.required]],
      },
      {
        validators: MustMatch('email', 'emailConfirm', true),
      },
    );

    this.authForm = this.formBuilder.group(
      {
        ruc: [{ value: '', disabled: true }, rucValidatorsComplete],
        name: [{ value: '', disabled: true }, authNameValidators],
        nameSelect: ['', [Validators.required]],
        entry: ['', [Validators.required]],
        entrySelect: [null as IEntryModel, [Validators.required]],
        password: ['', passwordValidators],
        passwordConfirm: ['', passwordValidators],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: MustMatch('password', 'passwordConfirm'),
      },
    );
  }

  resetCompanyForms() {
    this.registerForm.reset();
    this.authForm.reset();
  }

  setAuthFormNameValidator(name: string) {
    this.authForm
      .get('name')
      .setValidators([...authNameValidators, nameInvalid(name)]);
  }
}
