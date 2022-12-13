import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'ramda';
import { nameInvalid } from '../validators/name-invalid.validator';

@Injectable()
export class ServicesFormsService {
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;

  editNameValidators = [
    Validators.required,
    Validators.minLength(3),
    onlyAlphaNumber,
    Validators.pattern(
      '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
    ),
  ];

  constructor(private formBuilder: FormBuilder) {
    this.serviceForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        onlyAlphaNumber,
        notBlankSpaces,
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      account: new FormControl('', [Validators.required]),
      idAccount: new FormControl('', [Validators.required]),
      currency: new FormControl(''),
      accountNumber: new FormControl(''),
      useAppWeb: [{ value: true, disabled: true }],
      useAgent: [false],
    });

    const serviceDebtForm = this.formBuilder.group({
      paymentType: new FormControl('', [Validators.required]),
      partialPayment: new FormControl('S', [Validators.required]),
      chargeInterest: new FormControl('N', [Validators.required]),
      chargeType: new FormControl('', [Validators.required]),
      interestType: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
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
      dataType: new FormControl('S', [Validators.required]),
      debtorCode: new FormControl('', [Validators.required]),
      debtorCodeCustom: new FormControl('', [
        Validators.required,
        notBlankSpaces,
      ]),
      debt: serviceDebtForm,
    });

    this.editServiceForm = this.formBuilder.group({
      name: new FormControl('', this.editNameValidators),
      currency: new FormControl(''),
      useAppWeb: [true],
      useAgent: [false],
      debtorCode: new FormControl('', [Validators.required]),
      debtorCodeCustom: new FormControl('', [
        Validators.required,
        notBlankSpaces,
      ]),
      debt: serviceDebtForm,
    });
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
      .setValidators([...this.editNameValidators, nameInvalid(name)]);
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
