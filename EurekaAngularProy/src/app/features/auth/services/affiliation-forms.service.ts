import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { IEntryModel } from '../../../shared/models';
import {
  ModelFormGroup,
  SimpleModelFormGroup,
} from '../../../shared/models/forms';
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

export interface AuthForm {
  ruc: string;
  name: string;
  nameSelect: CompanyName;
  entry: string;
  entrySelect: IEntryModel;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
}

@Injectable()
export class AffiliationFormsService {
  registerForm: ModelFormGroup<RegisterForm>;
  authForm: SimpleModelFormGroup<AuthForm>;

  authNameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(80),
    notBlankSpaces,
  ];

  constructor(private formBuilder: FormBuilder) {
    const emailValidators = [
      Validators.required,
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
      Validators.minLength(10),
      Validators.maxLength(100),
    ];
    this.registerForm = this.formBuilder.group(
      {
        documentType: ['', [Validators.required]],
        documentNumber: ['', [Validators.required]],
        ruc: [
          '',
          [
            Validators.required,
            Validators.pattern('[1-2]0[0-9]+?'),
            Validators.minLength(11),
          ],
        ],
        email: ['', emailValidators],
        emailConfirm: ['', [Validators.required]],
        movilNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^9\d{8}$/),
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        movilOperator: ['', [Validators.required]],
      },
      {
        validators: MustMatch('email', 'emailConfirm', true),
      }
    );

    this.authForm = this.formBuilder.group(
      {
        ruc: [
          { value: '', disabled: true },
          [
            Validators.required,
            Validators.pattern('[1-2]0[0-9]+?'),
            Validators.minLength(11),
          ],
        ],
        name: [{ value: '', disabled: true }, this.authNameValidators],
        nameSelect: [null as CompanyName, this.authNameValidators],
        entry: ['', [Validators.required]],
        entrySelect: [null as IEntryModel, [Validators.required]],
        password: ['', passwordValidators],
        passwordConfirm: ['', passwordValidators],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: MustMatch('password', 'passwordConfirm'),
      }
    );
  }

  resetCompanyForms() {
    this.registerForm.reset();
    this.authForm.reset();
  }

  setAuthFormNameValidator(name: string) {
    this.authForm
      .get('name')
      .setValidators([...this.authNameValidators, nameInvalid(name)]);
  }
}

function notBlankSpaces(control: FormControl<string>) {
  if (isNil(control.value)) {
    return null;
  }
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}
