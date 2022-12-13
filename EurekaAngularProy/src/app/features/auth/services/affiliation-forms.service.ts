import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
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
        documentType: new FormControl('', [Validators.required]),
        documentNumber: new FormControl('', [Validators.required]),
        ruc: new FormControl('', [
          Validators.required,
          Validators.pattern('[1-2]0[0-9]+?'),
          Validators.minLength(11),
        ]),
        email: new FormControl('', emailValidators),
        emailConfirm: new FormControl('', [Validators.required]),
        movilNumber: new FormControl('', [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ]),
        movilOperator: new FormControl('', [Validators.required]),
      },
      {
        validator: MustMatch('email', 'emailConfirm', true),
      }
    );

    this.authForm = this.formBuilder.group(
      {
        ruc: new FormControl({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern('[1-2]0[0-9]+?'),
          Validators.minLength(11),
        ]),
        name: new FormControl('', this.authNameValidators),
        entry: new FormControl('', [Validators.required]),
        entrySelect: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          onlyOneLetter,
        ]),
        passwordConfirm: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          onlyOneLetter,
        ]),
        acceptTerms: new FormControl('', Validators.requiredTrue),
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

function onlyOneLetter(control: FormControl) {
  const regex = /[a-zA-Z]/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { unaletra: true };
  }
  return null;
}
