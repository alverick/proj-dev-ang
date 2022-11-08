import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { isNil } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { of, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IEntryModel, IServiceRemoteModel } from '../../../shared/models';
import { DataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../shared/models/forms';
import {
  CompanyService,
  ICompanyResult,
} from '../../../shared/services/company.service';
import { EnterpriseHeadingService } from '../../../shared/services/enterprise-heading.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { authFullRoutingNames } from '../auth-routing.names';

@Injectable()
export class AffiliationService {
  companyId;
  servicesList: IServiceRemoteModel[] = [];
  operators = [
    { value: 'M', label: 'Movistar' },
    { value: 'C', label: 'Claro' },
    { value: 'E', label: 'Entel' },
    { value: 'B', label: 'Bitel' },
  ];
  documentTypes = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de extranjeria' },
    { value: 'PASS', label: 'Pasaporte' },
  ];
  debtorCodeOptions: any[] = [
    {
      value: 'DNI',
      label: 'DNI',
    },
    {
      value: 'RUC',
      label: 'RUC',
    },
    {
      value: 'Codigo Interno',
      label: 'Celular',
    },
    {
      value: 'Otro',
      label: 'Otro (Cód. Interno, Cod. Alumno, N° de departamentos, etc.)',
    },
  ];

  paymentTypeOptions: any[] = [
    {
      value: 'C',
      label: 'Pueden elegir qué deuda quieren pagar',
    },
    {
      value: 'P',
      label: 'Siempre la deuda que vence primero',
    },
  ];

  interestTypeOptions: any[] = [
    {
      value: 'M',
      label: 'Monto',
    },
    {
      value: 'P',
      label: 'Porcentaje',
    },
  ];

  currencyOptions: any[] = [
    {
      value: '001',
      label: 'Soles',
      symbol: 'S/',
    },
    {
      value: '002',
      label: 'Dólares',
      symbol: '$',
    },
  ];

  chargeTypeOptions = [
    {
      value: '1',
      label: 'Diario',
    },
    {
      value: '2',
      label: 'Fijo',
    },
  ];

  errorMessages: IErrorMessages = {
    documentType: {
      required: 'Selecciona un tipo de documento',
    },
    documentNumber: {
      required: 'Número de documento es obligatorio',
      pattern: 'Ingresa un número de documento válido',
    },
    ruc: {
      required: 'El RUC es obligatorio',
      pattern: 'Ingresa un RUC válido',
      minlength: 'El RUC debe tener 11 dígitos',
    },
    email: {
      required: 'El correo electrónico es obligatorio',
      pattern: 'Ingresa un correo electrónico válido',
      minlength: 'El correo electrónico debe tener mínimo 10 dígitos',
    },
    emailConfirm: {
      required: 'Confirmar correo electrónico es obligatorio',
      mustMatch: 'El correo ingresado no coincide con el anterior',
    },
    movilNumber: {
      required: 'Celular es obligatorio',
      pattern: 'Ingrese un celular válido',
      minlength: 'Celular debe tener mínimo 9 dígitos',
    },
    movilOperator: {
      required: 'Selecciona un operador',
    },
  };

  errorMessagesAuth: IErrorMessages = {
    name: {
      required: 'El nombre comercial es obligatorio',
      pattern: 'Ingrese un nombre valido',
      minlength: 'El nombre debe tener mínimo 3 dígitos',
    },
    entry: {
      required: 'Elige una opción',
    },
    password: {
      required: 'La contraseña es obligatoria',
      minlength: 'La contraseña debe tener mínimo 6 dígitos',
      pattern: 'La contraseña debe tener por lo menos una letra',
    },
    passwordConfirm: {
      required: 'Debes repetir la contraseña',
      mustMatch: 'Debe ser igual a la contraseña',
      minlength: 'La contraseña debe tener mínimo 6 dígitos',
      pattern: 'La contraseña debe tener por lo menos una letra',
    },
    acceptTerms: {
      required: 'Acepte los términos y condiciones',
    },
  };

  errorMessagesService = {
    name: {
      required: 'Ingresa el concepto de cobro',
      pattern: 'Ingrese un nombre correcto',
      minlength: 'El nombre no puede tener menos de 3 caracteres',
      maxlength: 'El nombre no puede tener mas de 80 caracteres',
      alfa: 'El nombre debe tener por lo menos una letra o un numero',
      alfabetico: 'El nombre debe tener por lo menos una letra',
    },
    idAccount: {
      required: 'Elige una opción',
    },
  };

  errorMessagesServiceConfig = {
    amount: {
      required: 'Ingresa un monto',
    },
    dataType: {
      required: 'Elige una opción',
    },
    debtorCode: {
      required: 'Ingresa un código',
    },
    paymentType: {
      required: 'Elige una opción',
    },
    partialPayment: {
      required: 'Elige una opción',
    },
    idCuenta: {
      required: 'Elige una opción',
    },
    chargeType: {
      required: 'Elige una opción',
    },
    interestType: {
      required: 'Elige una opción',
    },
  };

  entryOptions: IEntryModel[] = [];
  registerForm: FormGroup;
  authForm: FormGroup;
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private enterpriseHeading: EnterpriseHeadingService
  ) {
    this.setRegisterForm();
  }

  public setRegisterForm() {
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
        validator: MustMatch('email', 'emailConfirm'),
      }
    );

    this.registerForm.controls.email.statusChanges.subscribe(() => {
      this.registerForm.controls.emailConfirm.updateValueAndValidity();
    });

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
        ]),
        entry: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          UnaLetra,
        ]),
        passwordConfirm: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          UnaLetra,
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
        Alfanumerico,
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

    const serviceDebtForm = this.formBuilder.group(
      {
        paymentType: new FormControl('', [Validators.required]),
        partialPayment: new FormControl('S', [Validators.required]),
        chargeInterest: new FormControl('no', [Validators.required]),
        chargeType: new FormControl('', [Validators.required]),
        interestType: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required]),
      },
      { disabled: true }
    );

    this.serviceConfigForm = this.formBuilder.group({
      dataType: new FormControl('S', [Validators.required]),
      debtorCode: new FormControl('', [Validators.required]),
      debt: serviceDebtForm,
    });

    this.editServiceForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Alfanumerico,
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

  setEditForm(position: number) {
    const {
      name,
      debtorCode,
      paymentType,
      currency,
      useAppWeb,
      useAgent,
      chargeInterest,
      chargeType,
      interestType,
      amount,
      percentage,
      partialPayment,
    } = this.servicesList[position];

    const amountField = interestType === 'M' ? amount : percentage;
    this.editServiceForm.setValue({
      name,
      debtorCode,
      useAppWeb,
      useAgent,
      currency,
      debt: {
        paymentType,
        chargeInterest,
        chargeType,
        interestType,
        amount: amountField,
        partialPayment,
      },
    });
  }

  public validateCompany(): Observable<ICompanyResult> {
    const {
      movilNumber,
      documentType,
      email,
      documentNumber,
      movilOperator,
      ruc,
    } = this.registerForm.value;
    return this.companyService
      .validateCompany({
        ruc,
        email,
        movilNumber,
        movilOperator,
        documentType,
        documentNumber,
      })
      .pipe(
        tap(({ code, success }) => {
          if (success) {
            this.authForm.get('ruc').setValue(ruc);
          } else {
            this.processResultCode(code);
          }
        }),
        catchError((err) => {
          this.showErrorServer();
          return throwError(err);
        })
      );
  }

  processResultCode(code: number) {
    switch (code) {
      case 1: {
        this.showMessageExistsCustomer();
        break;
      }
      case 2: {
        this.showMessageNoExistsAccounts();
        break;
      }
      case 3: {
        this.showMessageNoExistsAccounts();
        break;
      }
      default: {
        this.showErrorServer();
        break;
      }
    }
  }

  public saveCompany(): Observable<ICompanyResult> {
    const {
      movilNumber,
      documentType,
      email,
      documentNumber,
      movilOperator,
      ruc,
    } = this.registerForm.value;
    const { acceptTerms, entry, password, name } = this.authForm.value;
    const companyData: DataEnterpriseModel = {
      documentType,
      documentNumber,
      ruc,
      name,
      entry,
      email,
      movilNumber,
      movilOperator,
      password,
      acceptTerms,
    };
    return this.companyService.saveCompany(companyData).pipe(
      tap(({ code, success, id }) => {
        if (success) {
          console.log('id', id);
          this.companyId = id;
        } else {
          this.processResultCode(code);
        }
      }),
      catchError((err) => {
        this.showErrorServer();
        return throwError(err);
      })
    );
  }

  public saveService() {
    const { idAccount, name, useAppWeb, useAgent, accountNumber, currency } =
      this.serviceForm.value;
    const {
      dataType,
      debtorCode,
      debt: {
        paymentType = 'C',
        partialPayment = 'N',
        chargeInterest = 'N',
        chargeType = 0,
        interestType,
        amount,
      } = {
        paymentType: 'C',
        partialPayment: 'N',
        chargeInterest: 'N',
        chargeType: '0',
        interestType: null,
        amount: '0',
      },
    } = this.serviceConfigForm.value;

    this.servicesList.push({
      id: 0,
      name,
      newName: name,
      debtorCode,
      newNameCode: debtorCode,
      dataType,
      paymentType,
      idAccount,
      accountNumber,
      currency,
      useAppWeb,
      useAgent,
      useStore: false,
      chargeInterest,
      chargeType: chargeType * 1,
      interestType: isNil(interestType) ? 'M' : interestType,
      amount: interestType === 'M' ? amount * 1 : 0,
      percentage: interestType === 'P' ? amount * 1 : 0,
      partialPayment,
    });
    console.log('-> this.servicesList', this.servicesList);
  }

  saveAllServices() {
    return this.companyService.saveServices({
      clientId: this.companyId,
      deleted: [],
      services: this.servicesList,
    });
  }

  updateService(position: number, data) {
    const {
      name,
      debtorCode,
      useAgent,
      debt: {
        paymentType = 'C',
        partialPayment = 'N',
        chargeInterest = 'N',
        chargeType = 0,
        interestType,
        amount,
      } = {
        paymentType: 'C',
        partialPayment: 'N',
        chargeInterest: 'N',
        chargeType: '0',
        interestType: null,
        amount: '0',
      },
    } = this.editServiceForm.value;

    this.servicesList[position] = {
      ...this.servicesList[position],
      name,
      newName: name,
      debtorCode,
      newNameCode: debtorCode,
      paymentType,
      useAgent,
      chargeInterest,
      chargeType: chargeType * 1,
      interestType: isNil(interestType) ? 'M' : interestType,
      amount: interestType === 'M' ? amount * 1 : 0,
      percentage: interestType === 'P' ? amount * 1 : 0,
      partialPayment,
    };
  }

  public getEntryOptions(): Observable<IEntryModel[]> {
    if (isNotNilOrEmpty(this.entryOptions)) {
      return of(this.entryOptions);
    }
    return this.enterpriseHeading.getEntryOptions().pipe(
      tap((result) => {
        this.entryOptions = result;
      })
    );
  }

  showMessageExistsCustomer(): void {
    const { ruc } = this.registerForm.value;
    swalAlert.fire({
      title: 'Crea tu cuenta',
      text: `El RUC: ${ruc} ya se encuentra registrado en Cobro Simple`,
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonText: 'CERRAR',
    });
  }

  showMessageNoExistsAccounts(): void {
    swalAlert
      .fire({
        title: 'Abre tu Cuenta Negocios',
        text: `Te llevaremos a la página web de Interbank para abrir la cuenta. Una vez que llenes el formulario regresa aquí.`,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: 'CREAR MI CUENTA',
      })
      .then(({ value }) => {
        if (value) {
          window.open('https://interbank.pe/cuenta-negocios');
          this.router.navigate([authFullRoutingNames.LOGIN]);
        }
      });
  }

  showErrorServer() {
    swalAlert.fire({
      title: 'Regístrame',
      html: 'Ha ocurrido un error con el servidor<br />Intente de nuevo',
      showCloseButton: true,
      showConfirmButton: true,
    });
  }

  public getAccountsCompany(): Observable<any[]> {
    if (this.companyId) {
      return this.companyService.getCompanyAccountsById(this.companyId);
    }
    return this.companyService.getCompanyAccounts();
  }

  deleteService(position: number) {
    this.servicesList.splice(position, 1);
  }
}

function UnaLetra(c: FormControl) {
  const regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}

function Alfanumerico(c: FormControl) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (c.value && !regex.test(c.value)) {
    return { alfa: true };
  }
  return null;
}
