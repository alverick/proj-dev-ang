import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
import { atLeastOneLetter } from '../../../shared/validators/atLeastOneLetter.validator';
import { atLeastOneNumber } from '../../../shared/validators/atLeastOneNumber.validator';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { nameInvalid } from '../../../shared/validators/name-invalid.validator';

@Injectable()
export class AffiliationFormsService {
  registerForm: FormGroup;
  authForm: FormGroup;

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
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            atLeastOneLetter,
            atLeastOneNumber,
          ],
        ],
        passwordConfirm: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            atLeastOneLetter,
            atLeastOneNumber,
          ],
        ],
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

function notBlankSpaces(control: FormControl) {
  if (isNil(control.value)) {
    return null;
  }
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}
