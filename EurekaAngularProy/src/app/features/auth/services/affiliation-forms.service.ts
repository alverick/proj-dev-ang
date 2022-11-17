import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MustMatch } from '../../../shared/validators/must-match.validator';

@Injectable()
export class AffiliationFormsService {
  testData = 'demo';
  registerForm: FormGroup;
  authForm: FormGroup;
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;

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
        ruc: new FormControl({ value: '10123456789', disabled: true }, [
          Validators.required,
          Validators.pattern('[1-2]0[0-9]+?'),
          Validators.minLength(11),
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
          notBlankSpaces,
        ]),
        entry: new FormControl('', [Validators.required]),
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

    this.serviceForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        onlyAlphaNuber,
        notBlankSpaces,
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      idAccount: new FormControl('', [Validators.required]),
      currency: new FormControl(''),
      accountNumber: new FormControl(''),
      useAppWeb: [true],
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
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        onlyAlphaNuber,
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      currency: new FormControl(''),
      useAppWeb: [true],
      useAgent: [false],
      debtorCode: new FormControl('', [Validators.required]),
      debt: serviceDebtForm,
    });
  }

  resetServicesForms() {
    this.serviceForm.reset();
    this.serviceForm.setValue({
      name: '',
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
}

function notBlankSpaces(control: FormControl) {
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}

function onlyOneLetter(control: FormControl) {
  const regex = /[a-zA-Z]/g;
  if (control.value && !regex.test(control.value)) {
    return { unaletra: true };
  }
  return null;
}

function onlyAlphaNuber(control: FormControl) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (control.value && !regex.test(control.value)) {
    return { alfa: true };
  }
  return null;
}
