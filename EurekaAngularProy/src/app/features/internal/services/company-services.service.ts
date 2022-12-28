import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { isNil, pathEq } from 'ramda';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { parseParams } from '../../../shared/constants/services';
import { IServiceRemoteModel } from '../../../shared/models';
import {
  CompanyService,
  ServicesFormsService,
  ServiceService,
} from '../../../shared/services';
import { swalAlert } from '../../../shared/utils/helpers/popups';

@Injectable()
export class CompanyServicesService {
  services: Array<Partial<IServiceRemoteModel>> = [];
  serviceForm: FormGroup;
  serviceConfigForm: FormGroup;
  editServiceForm: FormGroup;
  constructor(
    private companyService: CompanyService,
    private serviceForms: ServicesFormsService,
    private serviceService: ServiceService,
    public activatedRoute: ActivatedRoute,
    private logger: NGXLogger
  ) {
    this.logger.debug('-> activatedRoute', activatedRoute);
    this.serviceForm = this.serviceForms.serviceForm;
    this.serviceConfigForm = this.serviceForms.serviceConfigForm;
    this.editServiceForm = this.serviceForms.editServiceForm;
  }

  getServices() {
    return this.companyService.getCompanyServices().pipe(
      tap((response) => {
        this.services = response;
      })
    );
  }

  canDelete(position: number) {
    return this.serviceService.checkCanDeleteService(
      this.services[position].id
    );
  }
  deleteService(position: number) {
    this.serviceService
      .deleteService(this.services[position].id)
      .subscribe(() => {
        this.companyService.getCompanyServices().subscribe((value) => {
          this.services = value;
        });
      });
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

    this.services.push({
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

    return this.saveAllServices().pipe(
      tap((result) => {
        this.logger.debug('-> result saveService', result);
        this.serviceForms.resetServicesForms();
      })
    );
  }

  saveAllServices() {
    if (this.services.length < 1) {
      swalAlert.fire({
        icon: 'warning',
        text: `Debes contar con al menos un servicio para continuar`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido',
      });
      return throwError('No services');
    }
    return this.saveServices();
  }

  setEditForm(position: number) {
    const {
      name,
      newName,
      debtorCode,
      newNameCode,
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
    } = this.services[position];
    this.logger.log('-> this.servicesList[position]', this.services[position]);

    if (inReview) {
      if (newNameGTPStatus === 3) {
        this.serviceForms.setEditFormValidator(newName);
      }
    }
    const amountField = interestType === 'M' ? amount : percentage;
    return {
      name,
      debtorCode:
        newNameCodeGTPStatus === 3 && isNil(debtorCode)
          ? newNameCode
          : debtorCode,
      useAppWeb,
      useAgent,
      currency,
      inReview,
      newNameGTPStatus,
      newNameCodeGTPStatus,
      newNameCode,
      nameOriginal: name || newName,
      debtorCodeOriginal: debtorCode || newNameCode,
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

    const serviceValues = parseParams(
      {
        debtorCodeCustom,
        debtorCode,
        amount,
        chargeType,
        interestType,
      },
      this.services[position]
    );

    const parsedName = pathEq(['services', position, 'name'], name, this)
      ? ''
      : name;

    this.services[position] = {
      ...this.services[position],
      name,
      newName: parsedName,
      paymentType,
      useAgent,
      chargeInterest,
      partialPayment,
      ...serviceValues,
    };
    return this.saveServices();
  }

  private saveServices() {
    const services = this.services
      .filter(
        ({ newNameGTPStatus, newNameCodeGTPStatus }) =>
          !(
            newNameGTPStatus === 0 ||
            newNameGTPStatus === 2 ||
            newNameCodeGTPStatus === 0 ||
            newNameCodeGTPStatus === 2
          )
      )
      .map(
        ({
          id,
          name,
          newName,
          debtorCode,
          newNameCode,
          dataType,
          paymentType,
          idAccount,
          accountNumber,
          currency,
          useAgent,
          chargeInterest,
          chargeType,
          interestType,
          amount,
          percentage,
          partialPayment,
        }) => {
          return {
            id,
            name,
            newName,
            debtorCode,
            newNameCode,
            dataType,
            paymentType,
            idAccount,
            accountNumber,
            currency,
            useAppWeb: true,
            useAgent,
            useStore: false,
            chargeInterest,
            chargeType,
            interestType,
            amount,
            percentage,
            partialPayment,
          };
        }
      );
    return this.companyService.saveServices({
      deleted: [],
      services,
    });
  }
}
