import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { isNotNil, isNotNilOrEmpty, isString } from 'ramda-adjunct';
import { of, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ICompanySendUpdate,
  ICompanyUpdate,
} from 'src/app/shared/models/company';
import { parseParams } from '../../../shared/constants/services';
import {
  IEntryModel,
  IServiceRemoteModel,
  IServiceRemoteModelForms,
} from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import {
  EnterpriseHeadingService,
  ServicesFormsService,
} from '../../../shared/services';
import {
  CompanyService,
  ICompanyResult,
} from '../../../shared/services/company.service';
import { LoginService } from '../../../shared/services/login.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationFormsService } from './affiliation-forms.service';

@Injectable()
export class AffiliationService {
  companyId;
  email;
  servicesList: Array<Partial<IServiceRemoteModelForms>> = [];

  entryOptions: IEntryModel[] = [];
  registerForm: FormGroup;
  authForm: FormGroup;
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;
  private updateData: ICompanyUpdate;
  tokenUpdate;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private loginService: LoginService,
    private enterpriseHeading: EnterpriseHeadingService,
    private affiliationForms: AffiliationFormsService,
    private serviceForms: ServicesFormsService,
    private logger: NGXLogger
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
      case 2:
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
      tap(({ code, success, id }) => {
        if (success) {
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
  }

  saveAllServices() {
    if (this.servicesList.length < 1) {
      swalAlert.fire({
        icon: 'warning',
        text: `Debes contar con al menos un servicio para continuar`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
      });
      return throwError('No services');
    }
    return this.companyService
      .saveServices({
        clientId: this.companyId,
        deleted: [],
        services: this.servicesList,
      })
      .pipe(
        tap(() => {
          this.resetRegistration();
        })
      );
  }

  saveUpdateInformation(): Observable<boolean> | Observable<never> {
    let modalSettings;
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
      swalAlert.fire(modalSettings);
      return throwError('Incomplete data');
    }

    return this.companyService
      .sendUpdateCompanyData(this.generatePayloadUpdate())
      .pipe(
        tap((result) => {
          if (result) {
            this.email = this.updateData.email;
          } else {
            swalAlert.fire({
              icon: 'warning',
              text: `Ha ocurrido un error`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido',
            });
          }
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
    this.companyId = '';
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
    this.logger.debug(
      '-> this.editServiceForm.value',
      this.servicesList[position],
      updatedData,
      formData
    );
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
    swalAlert.fire({
      icon: 'warning',
      text: `El RUC ingresado ya se encuentra registrado en Cobro Simple`,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
    });
  }

  showMessageNoExistsAccounts(): void {
    swalAlert
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
}
