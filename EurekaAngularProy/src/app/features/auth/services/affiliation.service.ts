import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { isNotNil, isNotNilOrEmpty, isString } from 'ramda-adjunct';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ICompanySendUpdate,
  ICompanyUpdate,
} from 'src/app/shared/models/company';
import { SweetAlertOptions } from 'sweetalert2';

import {
  chargeTypeOptions,
  dataTypeOptions,
  interestTypeOptions,
  parseParams,
  paymentTypeOptions,
} from '../../../shared/constants/services';
import {
  IEntryModel,
  IServiceRemoteModel,
  IServiceRemoteModelForms,
} from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import {
  ModelFormGroup,
  SimpleModelFormGroup,
} from '../../../shared/models/forms';
import {
  EnterpriseHeadingService,
  ServicesFormsService,
} from '../../../shared/services';
import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
  AdobeEventType,
} from '../../../shared/services/adobe-analytics.service';
import {
  CompanyService,
  ICompanyResult,
} from '../../../shared/services/company.service';
import { LoginService } from '../../../shared/services/login.service';
import {
  ServiceConfigurationForm,
  ServiceEditForm,
  ServiceFormValue,
} from '../../../shared/services/services-forms.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../auth-routing.names';
import {
  AffiliationFormsService,
  AuthForm,
  RegisterForm,
} from './affiliation-forms.service';

@Injectable()
export class AffiliationService {
  companyId: number;
  email: string;
  servicesList: Partial<IServiceRemoteModelForms>[] = [];

  entryOptions: IEntryModel[] = [];
  registerForm: ModelFormGroup<RegisterForm>;
  authForm: SimpleModelFormGroup<AuthForm>;
  serviceForm: ModelFormGroup<ServiceFormValue>;
  serviceConfigForm: ModelFormGroup<ServiceConfigurationForm>;
  editServiceForm: ModelFormGroup<ServiceEditForm>;
  updateData: ICompanyUpdate;
  tokenUpdate;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private loginService: LoginService,
    private enterpriseHeading: EnterpriseHeadingService,
    private affiliationForms: AffiliationFormsService,
    private serviceForms: ServicesFormsService,
    private logger: NGXLogger,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {
    this.setRegisterForm();
  }

  public setRegisterForm() {
    this.registerForm = this.affiliationForms.registerForm;
    this.authForm = this.affiliationForms.authForm;
    this.serviceForm = this.serviceForms.serviceForm;
    this.serviceConfigForm = this.serviceForms.serviceConfigForm;
    this.editServiceForm = this.serviceForms.editServiceForm;

    this.registerForm.controls.email.statusChanges.subscribe(() => {
      this.registerForm.controls.emailConfirm.updateValueAndValidity();
    });
  }

  setEditForm(position: number) {
    const {
      name,
      newName,
      newNameCode,
      debtorCode,
      paymentType,
      currency,
      useAppWeb,
      useAgent,
      chargeInterest,
      chargeType,
      dataType,
      interestType,
      inReview,
      amount,
      percentage,
      partialPayment,
      newNameGTPStatus,
      newNameCodeGTPStatus,
      nameOriginal,
      debtorCodeOriginal,
    } = this.servicesList[position];
    this.logger.log(
      '-> this.servicesList[position]',
      this.servicesList[position]
    );

    if (inReview) {
      if (newNameGTPStatus === 3) {
        this.serviceForms.setEditFormValidator(newName);
      }
    }

    let amountField = interestType === 'M' ? amount : percentage;
    if (inReview) {
      if (isString(amountField)) {
        amountField = parseFloat(amountField);
      }
      amountField = amountField.toFixed(2);
    }
    return {
      name,
      debtorCode,
      useAppWeb,
      useAgent,
      currency,
      inReview,
      newNameGTPStatus,
      newNameCodeGTPStatus,
      nameOriginal,
      debtorCodeOriginal,
      newNameCode,
      newName,
      debt: {
        dataType,
        paymentType,
        chargeInterest,
        chargeType,
        interestType,
        amount: amountField,
        partialPayment,
      },
    };
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

    const actionStep: Partial<ActionEventProperties> = {
      category: 'Registrate – Ingresa tus datos',
      action: 'Click',
      label: 'Siguiente',
      module: 'Home',
      location: 'Registrate',
      step: 'Step1',
      state: 'Envío exitoso',
      metadata: [
        {
          key: 'TipoDocumento',
          value: documentType,
        },
        {
          key: 'Operador',
          value: movilOperator,
        },
      ],
    };

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
        tap(({ code, message, success }) => {
          if (success) {
            this.authForm.get('ruc').setValue(ruc);
            this.sendAdobeTrack(AdobeEvent.trackFormSubmit, actionStep);
          } else {
            this.processResultCode(code, message, {
              ...actionStep,
              state: 'Intención de envío',
            });
          }
        }),
        catchError((err) => {
          this.sendAdobeTrack(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intención de envío',
            typeError: 'Ha ocurrido un error con el servidor',
          });
          this.showErrorServer();
          return throwError(err);
        })
      );
  }

  processResultCode(
    code: number,
    message: string,
    action: Partial<ActionEventProperties>
  ) {
    let typeError = '';
    let titleError = '';
    switch (code) {
      case 1: {
        this.showMessageExistsCustomer();
        typeError =
          'El RUC ingresado ya se encuentra registrado en Cobro Simple';
        break;
      }
      case 2:
      case 3: {
        this.showMessageNoExistsAccounts();
        titleError = '¡Abre tu Cuenta Negocios!';
        typeError =
          'Debes tener una cuenta corriente o ahorros persona jurídica';
        break;
      }
      default: {
        this.showErrorServer(message || '');
        titleError = 'Regístrame';
        typeError = message || 'Ha ocurrido un error con el servidor';
        break;
      }
    }
    this.sendAdobeTrack(AdobeEvent.trackFormSubmit, {
      ...action,
      typeError,
    });

    this.sendAdobeTrack(AdobeEvent.trackView, {
      category: titleError,
      action: 'modal-view',
      detail: typeError,
      module: 'Home',
      location: 'Modal',
    });
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

    const { acceptTerms, entry, password, name, entrySelect } =
      this.authForm.value;

    const actionStep: Partial<ActionEventProperties> = {
      category: 'Registrate – Datos de empresa',
      action: 'Click',
      label: 'Siguiente',
      module: 'Home',
      location: 'Registrate',
      step: 'Step2',
      state: 'Envío exitoso',
      metadata: [
        {
          key: 'Rubro Empresa',
          value: entrySelect.name,
        },
      ],
    };
    const companyData: IDataEnterpriseModel = {
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
      tap(({ code, success, id, message }) => {
        if (success) {
          this.companyId = id;
          this.sendAdobeTrack(AdobeEvent.trackFormSubmit, actionStep);
        } else {
          this.processResultCode(code, message, {
            ...actionStep,
            state: 'Intención de envío',
          });
        }
      }),
      catchError((err) => {
        this.sendAdobeTrack(AdobeEvent.trackFormSubmit, {
          ...actionStep,
          state: 'Intención de envío',
          typeError: 'Ha ocurrido un error con el servidor',
        });
        this.showErrorServer();
        return throwError(err);
      })
    );
  }

  public saveService() {
    const { idAccount, name, useAgent, accountNumber, currency } =
      this.serviceForm.value;
    const {
      dataType,
      debtorCode,
      debtorCodeCustom,
      debt: {
        paymentType = 'C',
        partialPayment = 'N',
        chargeInterest = 'N',
        chargeType = '',
        interestType,
        amount,
      } = {
        paymentType: 'C',
        partialPayment: 'N',
        chargeInterest: 'N',
        chargeType: '',
        interestType: null,
        amount: '1.00',
      },
    } = this.serviceConfigForm.value;

    const serviceValues = parseParams({
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType,
    });

    this.servicesList.push({
      id: null,
      name,
      newName: name,
      dataType,
      paymentType,
      idAccount,
      accountNumber,
      currency,
      useAppWeb: true,
      useAgent,
      useStore: false,
      chargeInterest,
      partialPayment,
      ...serviceValues,
    });
    this.serviceForms.resetServicesForms();

    const metadata = [
      {
        key: 'Tipo de servicio',
        value: dataTypeOptions.find((item) => dataType === item.value).label,
      },
      {
        key: 'Codigo cliente',
        value: serviceValues.debtorCode,
      },
      {
        key: 'Orden a pagar',
        value: paymentTypeOptions.find((item) => paymentType === item.value)
          .label,
      },
      {
        key: 'Pago parcial',
        value: (partialPayment === 'S').toString(),
      },
      {
        key: 'Pago mora',
        value: (chargeInterest === 'S').toString(),
      },
    ];

    if (chargeInterest === 'S') {
      metadata.push(
        {
          key: 'Tipo cobro',
          value: chargeTypeOptions.find((item) => chargeType === item.value)
            .label,
        },
        {
          key: 'Tipo calculo',
          value: interestTypeOptions.find((item) => interestType === item.value)
            .label,
        },
        {
          key: 'Monto',
          value: amount,
        }
      );
    }

    this.sendAdobeTrack(AdobeEvent.trackFormSubmit, {
      category: 'Registrate – Configuración de servicio',
      action: 'Click',
      label: 'Siguiente',
      module: 'Home',
      location: 'Registrate',
      step: 'Step4',
      state: 'Envío exitoso',
      metadata,
    });
  }

  saveAllServices() {
    if (this.servicesList.length < 1) {
      void swalAlert.fire({
        icon: 'warning',
        text: `Debes contar con al menos un servicio para continuar`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
      });
      return throwError('No services');
    }

    const actionStep = {
      category: 'Registrate – Resumen de servicios',
      action: 'Click',
      label: 'Siguiente',
      module: 'Home',
      location: 'Registrate',
      step: 'Step5',
      state: 'Envío exitoso',
    };

    return this.companyService
      .saveServices({
        clientId: this.companyId,
        deleted: [],
        services: this.servicesList,
      })
      .pipe(
        tap(() => {
          this.sendAdobeTrack(AdobeEvent.trackFormSubmit, actionStep);
          this.resetRegistration();
        }),
        catchError((err) => {
          this.sendAdobeTrack(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intención de envío',
            typeError: 'Ha ocurrido un error con el servidor',
          });
          throw new Error(err);
        })
      );
  }

  saveUpdateInformation(): Observable<boolean> | Observable<never> {
    let modalSettings: SweetAlertOptions;
    if (
      this.updateData.newNameGTPStatus === 3 &&
      this.updateData.newName === this.authForm.get('name').value
    ) {
      modalSettings = {
        icon: 'warning',
        text: `El nombre comercial debe ser actualizado`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
      };
    } else if (
      this.servicesList.some(
        ({
          inReview,
          name,
          newName,
          newNameGTPStatus,
          debtorCode,
          newNameCode,
          newNameCodeGTPStatus,
        }) =>
          inReview &&
          ((newNameGTPStatus === 3 && name === newName) ||
            (newNameCodeGTPStatus === 3 && debtorCode === newNameCode))
      )
    ) {
      modalSettings = {
        icon: 'warning',
        text: `Debe actualizar todos los servicios observados`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
      };
    }

    if (isNotNil(modalSettings)) {
      void swalAlert.fire(modalSettings);
      return throwError('Incomplete data');
    }

    return this.companyService
      .sendUpdateCompanyData(this.generatePayloadUpdate())
      .pipe(
        tap((result) => {
          if (result) {
            this.email = this.updateData.email;
          } else {
            void swalAlert.fire({
              icon: 'warning',
              text: `Ha ocurrido un error`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido',
            });
          }
          this.updateData = null;
        })
      );
  }

  generatePayloadUpdate(): ICompanySendUpdate {
    return {
      Token: this.tokenUpdate,
      NewName: this.updateData.inReview
        ? this.authForm.get('name').value
        : null,
      ArrayServices: this.servicesList.map(
        ({
          debtorCode,
          id,
          inReview,
          name,
          newNameCodeGTPStatus,
          newNameGTPStatus,
        }) => {
          return {
            ServiceId: id,
            NewName: inReview && newNameGTPStatus === 3 ? name : null,
            NewCodName:
              inReview && newNameCodeGTPStatus === 3 ? debtorCode : null,
          };
        }
      ),
    };
  }

  resetRegistration() {
    this.companyId = null;
    this.email = this.registerForm.value.email;
    this.servicesList = [];
    this.affiliationForms.resetCompanyForms();
  }

  updateEditServiceName(position: number) {
    const { currency, ...formData } = this.editServiceForm.value;
    const updatedData: Partial<IServiceRemoteModel> = {};
    if (this.servicesList[position].newNameGTPStatus === 3) {
      updatedData.name = formData.name;
    }
    if (this.servicesList[position].newNameCodeGTPStatus === 3) {
      updatedData.debtorCode =
        formData.debtorCode === 'Otro'
          ? formData.debtorCodeCustom
          : formData.debtorCode;
    }
    this.servicesList[position] = {
      ...this.servicesList[position],
      ...updatedData,
    };
  }

  updateEditService(position: number) {
    const {
      name,
      debtorCode,
      debtorCodeCustom,
      useAgent,
      debt: {
        paymentType = 'C',
        partialPayment = 'N',
        chargeInterest = 'N',
        chargeType = '',
        interestType,
        amount,
      } = {
        paymentType: 'C',
        partialPayment: 'N',
        chargeInterest: 'N',
        chargeType: '',
        interestType: null,
        amount: '1.00',
      },
    } = this.editServiceForm.value;

    const serviceValues = parseParams({
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType,
    });

    this.servicesList[position] = {
      ...this.servicesList[position],
      name,
      newName: name,
      paymentType,
      useAgent,
      chargeInterest,
      partialPayment,
      ...serviceValues,
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
    void swalAlert.fire({
      icon: 'warning',
      text: `El RUC ingresado ya se encuentra registrado en Cobro Simple`,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
    });
  }

  showMessageNoExistsAccounts(): void {
    void swalAlert
      .fire({
        title: '¡Abre tu Cuenta Negocios!',
        html: `Debes tener una cuenta corriente o ahorros persona jurídica para registrarte en Cobro Simple. <br>
Te llevaremos a abrir una Cuenta Negocios 100% digital.`,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: '¡Vamos ahora!',
      })
      .then(({ value }) => {
        if (value) {
          window.open('https://interbank.pe/cuenta-negocios');
          void this.router.navigate([authFullRoutingNames.LOGIN]);
        }
      });
  }

  showErrorServer(message: string = '') {
    void swalAlert.fire({
      title: 'Regístrame',
      html:
        message || 'Ha ocurrido un error con el servidor<br />Intente de nuevo',
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

  removeEditService() {
    this.editServiceForm.reset();
  }

  setUpdateFormsData(data: ICompanyUpdate): void {
    this.updateData = data;
    let parsedName = data.name;
    if (data.newNameGTPStatus === 3) {
      parsedName = data.newName;
      this.affiliationForms.setAuthFormNameValidator(parsedName);
    }
    this.authForm.patchValue({
      ruc: data.ruc,
      name: parsedName,
      entry: data.entry,
    });
    this.authForm.get('entrySelect').disable();
    this.servicesList = data.arrayServices.map((service) => {
      return {
        ...service,
        name: service.name || service.newName,
        debtorCode: service.debtorCode || service.newNameCode,
        nameOriginal: service.name || service.newName,
        debtorCodeOriginal: service.debtorCode || service.newNameCode,
      };
    });
  }

  validateTokenForUpdate(token: string): Observable<ICompanyUpdate | boolean> {
    return this.loginService
      .getCompanyDataUpdate({ TokenEncrypted: token })
      .pipe(
        tap((result: ICompanyUpdate | null) => {
          if (result) {
            this.tokenUpdate = token;
            this.setUpdateFormsData(result);
          }
        })
      );
  }

  sendAdobeTrack(
    event: AdobeEventType,
    eventProperties: Partial<ActionEventProperties>
  ) {
    this.adobeAnalytics.trackEvent(event, eventProperties);
  }
}
