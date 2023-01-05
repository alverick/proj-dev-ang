import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
import { MustMatch } from '../../../shared/validators/must-match.validator';

@Injectable()
export class AffiliationFormsService {
  registerForm: UntypedFormGroup;
  authForm: UntypedFormGroup;
  serviceForm: UntypedFormGroup;
  serviceConfigForm: UntypedFormGroup;
  editServiceForm: UntypedFormGroup;

  authNameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(80),
    notBlankSpaces,
  ];

  editNameValidators = [
    Validators.required,
    Validators.minLength(3),
    onlyAlphaNumber,
    Validators.pattern(
      '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
    ),
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
        documentType: new UntypedFormControl('', [Validators.required]),
        documentNumber: new UntypedFormControl('', [Validators.required]),
        ruc: new UntypedFormControl('', [
          Validators.required,
          Validators.pattern('[1-2]0[0-9]+?'),
          Validators.minLength(11),
        ]),
        email: new UntypedFormControl('', emailValidators),
        emailConfirm: new UntypedFormControl('', [Validators.required]),
        movilNumber: new UntypedFormControl('', [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ]),
        movilOperator: new UntypedFormControl('', [Validators.required]),
      },
      {
        validator: MustMatch('email', 'emailConfirm', true),
      }
    );

    this.authForm = this.formBuilder.group(
      {
        ruc: new UntypedFormControl({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern('[1-2]0[0-9]+?'),
          Validators.minLength(11),
        ]),
        name: new UntypedFormControl('', this.authNameValidators),
        entry: new UntypedFormControl('', [Validators.required]),
        entrySelect: new UntypedFormControl('', [Validators.required]),
        password: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          onlyOneLetter,
        ]),
        passwordConfirm: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          onlyOneLetter,
        ]),
        acceptTerms: new UntypedFormControl('', Validators.requiredTrue),
      },
      {
        validator: MustMatch('password', 'passwordConfirm'),
      }
    );

    this.serviceForm = this.formBuilder.group({
      name: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(3),
        onlyAlphaNumber,
        notBlankSpaces,
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      account: new UntypedFormControl('', [Validators.required]),
      idAccount: new UntypedFormControl('', [Validators.required]),
      currency: new UntypedFormControl(''),
      accountNumber: new UntypedFormControl(''),
      useAppWeb: [true],
      useAgent: [false],
    });

    const serviceDebtForm = this.formBuilder.group({
      paymentType: new UntypedFormControl('', [Validators.required]),
      partialPayment: new UntypedFormControl('S', [Validators.required]),
      chargeInterest: new UntypedFormControl('N', [Validators.required]),
      chargeType: new UntypedFormControl('', [Validators.required]),
      interestType: new UntypedFormControl('', [Validators.required]),
      amount: new UntypedFormControl('', [Validators.required]),
    });

    serviceDebtForm.get('interestType').valueChanges.subscribe((val) => {
      serviceDebtForm.get('amount').setValue('');
      if (val === 'P') {
        serviceDebtForm
          .get('amount')
          .setValidators([
            Validators.required,
            Validators.min(0.01),
            Validators.max(100),
          ]);
      } else {
        serviceDebtForm
          .get('amount')
          .setValidators([
            Validators.required,
            Validators.min(0.5),
            Validators.max(1000),
          ]);
      }
    });

    this.serviceConfigForm = this.formBuilder.group({
      dataType: new UntypedFormControl('S', [Validators.required]),
      debtorCode: new UntypedFormControl('', [Validators.required]),
      debtorCodeCustom: new UntypedFormControl('', [
        Validators.required,
        notBlankSpaces,
      ]),
      debt: serviceDebtForm,
    });

    this.editServiceForm = this.formBuilder.group({
      name: new UntypedFormControl('', this.editNameValidators),
      currency: new UntypedFormControl(''),
      useAppWeb: [true],
      useAgent: [false],
      debtorCode: new UntypedFormControl('', [Validators.required]),
      debtorCodeCustom: new UntypedFormControl('', [
        Validators.required,
        notBlankSpaces,
      ]),
      debt: serviceDebtForm,
    });
  }

  resetCompanyForms() {
    this.registerForm.reset();
    this.authForm.reset();
  }

  resetServicesForms() {
    this.serviceForm.reset();
    this.serviceForm.setValue({
      name: '',
      account: '',
      idAccount: '',
      currency: '',
      accountNumber: '',
      useAppWeb: true,
      useAgent: false,
    });
    this.serviceConfigForm.reset();
    this.serviceConfigForm.setValue({
      dataType: 'S',
      debtorCode: '',
      debtorCodeCustom: '',
      debt: {
        paymentType: '',
        partialPayment: 'S',
        chargeInterest: 'N',
        chargeType: '',
        interestType: '',
        amount: '',
      },
    });
  }

  setEditFormValidator(name: string) {
    this.editServiceForm
      .get('name')
      .setValidators([...this.editNameValidators, changeName(name)]);
  }

  setAuthFormNameValidator(name: string) {
    this.authForm
      .get('name')
      .setValidators([...this.authNameValidators, changeName(name)]);
  }
}

function changeName(name: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === name) {
      return { change: true };
    }
    return null;
  };
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

function onlyOneLetter(control: UntypedFormControl) {
  const regex = /[a-zA-Z]/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { unaletra: true };
  }
  return null;
}

function onlyAlphaNumber(control: UntypedFormControl) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { alfa: true };
  }
  return null;
}
