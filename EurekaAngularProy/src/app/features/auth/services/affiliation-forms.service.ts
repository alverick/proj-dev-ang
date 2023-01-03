import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
import { atLeastOneLetter } from '../../../shared/validators/atLeastOneLetter.validator';
import { atLeastOneNumber } from '../../../shared/validators/atLeastOneNumber.validator';
import { MustMatch } from '../../../shared/validators/must-match.validator';

@Injectable()
export class AffiliationFormsService {
  registerForm: FormGroup;
  authForm: FormGroup;
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;

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

    this.serviceForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          onlyAlphaNumber,
          notBlankSpaces,
          Validators.pattern(
            '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
          ),
        ],
      ],
      account: ['', [Validators.required]],
      idAccount: ['', [Validators.required]],
      currency: [''],
      accountNumber: [''],
      useAppWeb: [{ value: true, disabled: true }],
      useAgent: [false],
    });

    const serviceDebtForm = this.formBuilder.group({
      paymentType: ['', [Validators.required]],
      partialPayment: ['S', [Validators.required]],
      chargeInterest: ['N', [Validators.required]],
      chargeType: ['', [Validators.required]],
      interestType: ['', [Validators.required]],
      amount: ['', [Validators.required]],
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
      dataType: ['S', [Validators.required]],
      debtorCode: ['', [Validators.required]],
      debtorCodeCustom: ['', [Validators.required, notBlankSpaces]],
      debt: serviceDebtForm,
    });

    this.editServiceForm = this.formBuilder.group({
      name: ['', this.editNameValidators],
      currency: [''],
      useAppWeb: [{ value: true, disabled: true }],
      useAgent: [false],
      debtorCode: ['', [Validators.required]],
      debtorCodeCustom: ['', [Validators.required, notBlankSpaces]],
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

  setServiceEditDebtorCodeValidate(isCustom: boolean, name: string) {
    const validators = [Validators.required];
    if (isCustom) {
      validators.push(changeName(name));
    } else {
      validators.push(changeName(name));
    }
    this.editServiceForm
      .get('debtorCodeCustom')
      .setValidators([notBlankSpaces, ...validators]);
    this.editServiceForm.get('debtorCode').setValidators(validators);
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

function notBlankSpaces(control: FormControl) {
  if (isNil(control.value)) {
    return null;
  }
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}

function onlyAlphaNumber(control: FormControl) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { alfa: true };
  }
  return null;
}
