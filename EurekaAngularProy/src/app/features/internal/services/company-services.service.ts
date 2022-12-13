import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
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
  services: IServiceRemoteModel[] = [];
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
    return this.serviceService
      .deleteService(this.services[position].id)
      .pipe(tap(() => {}));
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

    const serviceValues = parseParams(
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType
    );

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
        this.logger.debug('-> result', result);
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
    return this.companyService.saveServices({
      clientId: null,
      deleted: [],
      services: this.services,
    });
  }

  setEditForm(position: number) {
    const {
      name,
      newName,
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
    } = this.services[position];
    this.logger.trace(
      '-> this.servicesList[position]',
      this.services[position]
    );

    if (inReview) {
      this.serviceForms.setEditFormValidator(newName);
    }

    const amountField = interestType === 'M' ? amount : percentage;
    return {
      name,
      debtorCode,
      useAppWeb,
      useAgent,
      currency,
      inReview,
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
      debtorCodeCustom,
      debtorCode,
      amount,
      chargeType,
      interestType
    );

    this.services[position] = {
      ...this.services[position],
      name,
      newName: name,
      paymentType,
      useAgent,
      chargeInterest,
      partialPayment,
      ...serviceValues,
    };

    return this.companyService.saveServices({
      clientId: null,
      deleted: [],
      services: this.services,
    });
  }
}
