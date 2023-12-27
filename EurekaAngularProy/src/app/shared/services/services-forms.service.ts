import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { isNil } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';

import { ModelFormGroup } from '../models/forms';
import { nameInvalid } from '../validators/name-invalid.validator';

export interface ServiceFormValue {
  name: string;
  account: string;
  idAccount: string;
  currency: string;
  accountNumber: string;
  useAppWeb: boolean;
  useAgent: boolean;
}

export interface ServiceConfigurationForm {
  dataType: ServiceTypeType;
  debtorCode: string;
  debtorCodeCustom: string;
  debt: ServiceDebt;
}

export interface ServiceEditForm {
  name: string;
  currency: string;
  useAppWeb: boolean;
  useAgent: boolean;
  debtorCode: string;
  debtorCodeCustom: string;
  debt: ServiceDebt;
}

export interface ServiceDebt {
  paymentType: string;
  partialPayment: string;
  chargeInterest: string;
  chargeType: string;
  interestType: string;
  amount: string;
}

export const ServiceTypes = {
  withoutData: 'S',
  partial: 'P',
  complete: 'C',
} as const;

export type ServiceTypeType = (typeof ServiceTypes)[keyof typeof ServiceTypes];

@Injectable()
export class ServicesFormsService {
  serviceForm: ModelFormGroup<ServiceFormValue>;
  serviceConfigForm: ModelFormGroup<ServiceConfigurationForm>;
  editServiceForm: ModelFormGroup<ServiceEditForm>;
  defaultServiceType: ServiceTypeType = ServiceTypes.complete;

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

    const serviceDebtForm: ModelFormGroup<ServiceDebt> = this.formBuilder.group(
      {
        paymentType: ['', [Validators.required]],
        partialPayment: ['S', [Validators.required]],
        chargeInterest: ['N', [Validators.required]],
        chargeType: ['', [Validators.required]],
        interestType: ['', [Validators.required]],
        amount: ['', [Validators.required]],
      }
    );

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
      dataType: [this.defaultServiceType, [Validators.required]],
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
      dataType: this.defaultServiceType,
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

  setServiceEditDebtorCodeValidate(isCustom: boolean, name = '') {
    const validators = [Validators.required];
    if (isNotEmpty(name)) {
      validators.push(nameInvalid(name));
    }
    this.editServiceForm
      .get('debtorCodeCustom')
      .setValidators([notBlankSpaces, ...validators]);
    this.editServiceForm.get('debtorCode').setValidators(validators);
  }

  setEditFormValidator(name = '') {
    const validators = [Validators.required];
    if (isNotEmpty(name)) {
      validators.push(nameInvalid(name));
    }
    this.editServiceForm.get('name').setValidators(validators);
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

function onlyAlphaNumber(control: FormControl<string>) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { alfa: true };
  }
  return null;
}
