import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { nameInvalid } from '../../../shared/validators/name-invalid.validator';
import { passwordValidators } from '../../../shared/validators/password-validators';

@Injectable()
export class AffiliationFormsService {
  registerForm: UntypedFormGroup;
  authForm: UntypedFormGroup;

  authNameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(80),
    notBlankSpaces,
  ];

  constructor(private formBuilder: UntypedFormBuilder) {
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
        validator: MustMatch('email', 'emailConfirm', true),
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
        name: ['', this.authNameValidators],
        entry: ['', [Validators.required]],
        entrySelect: ['', [Validators.required]],
        password: ['', passwordValidators],
        passwordConfirm: ['', passwordValidators],
        acceptTerms: ['', Validators.requiredTrue],
      },
      {
        validator: MustMatch('password', 'passwordConfirm'),
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

function notBlankSpaces(control: UntypedFormControl) {
  if (isNil(control.value)) {
    return null;
  }
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}
