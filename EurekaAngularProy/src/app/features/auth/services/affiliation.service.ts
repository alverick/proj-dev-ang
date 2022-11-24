import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty, isNil } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { of, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IEntryModel, IServiceRemoteModel } from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import {
  CompanyService,
  ICompanyResult,
} from '../../../shared/services/company.service';
import { EnterpriseHeadingService } from '../../../shared/services/enterprise-heading.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../auth-routing.names';
import { debtorCodeCustomEmpty } from '../constants';
import { AffiliationFormsService } from './affiliation-forms.service';

@Injectable()
export class AffiliationService {
  companyId;
  email;
  servicesList: IServiceRemoteModel[] = [];

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
    private enterpriseHeading: EnterpriseHeadingService,
    private affiliationForms: AffiliationFormsService
  ) {
    this.setRegisterForm();
  }

  public setRegisterForm() {
    this.registerForm = this.affiliationForms.registerForm;
    this.authForm = this.affiliationForms.authForm;
    this.serviceForm = this.affiliationForms.serviceForm;
    this.serviceConfigForm = this.affiliationForms.serviceConfigForm;
    this.editServiceForm = this.affiliationForms.editServiceForm;

    this.registerForm.controls.email.statusChanges.subscribe(() => {
      this.registerForm.controls.emailConfirm.updateValueAndValidity();
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
      dataType,
      interestType,
      amount,
      percentage,
      partialPayment,
    } = this.servicesList[position];

    const amountField = interestType === 'M' ? amount : percentage;
    return {
      name,
      debtorCode,
      useAppWeb,
      useAgent,
      currency,
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
    const {
      acceptTerms,
      entry: { code: codeEntry },
      password,
      name,
    } = this.authForm.value;
    const companyData: IDataEnterpriseModel = {
      documentType,
      documentNumber,
      ruc,
      name,
      entry: codeEntry,
      email,
      movilNumber,
      movilOperator,
      password,
      acceptTerms,
    };
    console.log('-> companyData', companyData);
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
    const { idAccount, name, useAppWeb, useAgent, accountNumber, currency } =
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

    const serviceValues = this.parseParams(
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType
    );

    this.servicesList.push({
      id: null,
      name,
      newName: name,
      dataType,
      paymentType,
      idAccount,
      accountNumber,
      currency,
      useAppWeb,
      useAgent,
      useStore: false,
      chargeInterest,
      partialPayment,
      ...serviceValues,
    });
    this.affiliationForms.resetServicesForms();
    console.log('-> this.servicesList', this.servicesList);
  }

  private parseParams(
    debtorCodeCustom,
    debtorCode,
    amount,
    chargeType,
    interestType
  ) {
    const parsedDebtorCode =
      debtorCodeCustom === debtorCodeCustomEmpty
        ? debtorCode
        : debtorCodeCustom;

    const parseAmount = parseFloat(amount).toFixed(2);

    return {
      debtorCode: parsedDebtorCode,
      newNameCode: parsedDebtorCode,
      chargeType: isEmpty(chargeType) ? '' : parseInt(chargeType, 10),
      interestType: isNil(interestType) ? 'M' : interestType,
      amount: interestType === 'M' ? parseAmount : '1.00',
      percentage: interestType === 'P' ? parseAmount : '1.00',
    };
  }

  saveAllServices() {
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

  resetRegistration() {
    this.email = this.registerForm.value.email;
    this.servicesList = [];
    this.affiliationForms.resetCompanyForms();
  }

  updateEditService(position: number, data) {
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

    const serviceValues = this.parseParams(
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType
    );

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

  removeEditService() {
    this.editServiceForm.reset();
  }
}
