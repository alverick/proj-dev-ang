import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { forEachObjIndexed, isNil, omit, pathEq } from 'ramda';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  chargeTypeOptions,
  dataTypeOptions,
  interestTypeOptions,
  parseParams,
  paymentTypeOptions,
  statusCodes,
} from '../../../shared/constants/services';
import { type IServiceRemoteModel } from '../../../shared/models';
import { type ModelFormGroup } from '../../../shared/models/forms';
import {
  CompanyService,
  ServiceService,
  ServicesFormsService,
} from '../../../shared/services';
import {
  type ServiceConfigurationForm,
  type ServiceEditForm,
  type ServiceFormValue,
  type ServiceTypeType,
} from '../../../shared/services/services-forms.service';
import {
  type ActionEventProperties,
  type Metadata,
  AdobeEvent,
  Metadata,
} from '../../../shared/services/adobe-analytics.service';
import {
  ServiceConfigurationForm,
  ServiceEditForm,
  ServiceFormValue,
  ServiceTypeType,
} from '../../../shared/services/services-forms.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';

@Injectable()
export class CompanyServicesService {
  get allowAllServiceType(): boolean {
    return this._allowAllServiceType;
  }

  set allowAllServiceType(value: boolean) {
    this._allowAllServiceType = value;
    this.serviceForms.defaultServiceType = value ? 'S' : 'C';
  }
  services: Partial<IServiceRemoteModel>[] = [];
  serviceForm: ModelFormGroup<ServiceFormValue>;
  serviceConfigForm: ModelFormGroup<ServiceConfigurationForm>;
  editServiceForm: ModelFormGroup<ServiceEditForm>;
  private _allowAllServiceType = false;

  constructor(
    private companyService: CompanyService,
    private serviceForms: ServicesFormsService,
    private serviceService: ServiceService,
    private logger: NGXLogger,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {
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

  setDefaultType(value: ServiceTypeType) {
    this.serviceConfigForm.patchValue({ dataType: value });
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

    this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
      category: 'Servicios agregar nuevo servicio',
      action: 'Click',
      label: 'Siguiente',
      location: 'Servicios agregar',
      step: 'Step2',
      state: 'Envío exitoso',
      metadata,
    });

    return this.saveAllServices();
  }

  saveAllServices() {
    if (this.services.length < 1) {
      this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
        category: 'warning - icon',
        action: 'modal-view',
        detail: 'Debes contar con al menos un servicio para continuar.',
        location: 'Modal',
      });
      void swalAlert.fire({
        icon: 'warning',
        text: `Debes contar con al menos un servicio para continuar.`,
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

    if (newNameGTPStatus === statusCodes.REJECTED) {
      this.serviceForms.setEditFormValidator(newName);
    } else {
      this.serviceForms.setEditFormValidator();
    }

    const amountField = interestType === 'M' ? amount : percentage;
    return {
      name:
        newNameGTPStatus === statusCodes.REJECTED && isNil(name)
          ? newName
          : name,
      debtorCode:
        newNameCodeGTPStatus === statusCodes.REJECTED && isNil(debtorCode)
          ? newNameCode
          : debtorCode,
      useAppWeb,
      useAgent,
      currency,
      inReview,
      newNameGTPStatus,
      newNameCodeGTPStatus,
      newNameCode,
      newName,
      nameOriginal: newName || name,
      debtorCodeOriginal: newNameCode || debtorCode,
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

    const formValue = omit(['debt'], this.editServiceForm.value);
    const metadata: Metadata[] = [];
    forEachObjIndexed(
      (value, key) => {
        metadata.push({
          key,
          value: value as string,
        });
      },
      { ...formValue, ...this.editServiceForm.value.debt }
    );
    const actionStep: Partial<ActionEventProperties> = {
      category: 'Servicios',
      action: 'Click',
      label: 'Guardar',
      location: 'Panel',
      step: 'Not available',
      state: 'Envío exitoso',
      metadata,
    };

    this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, actionStep);

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

    let parsedName: string;
    if (pathEq(['services', position, 'name'], name, this)) {
      if (
        !pathEq(
          ['services', position, 'newNameGTPStatus'],
          statusCodes.REJECTED,
          this
        )
      ) {
        parsedName = '';
      } else {
        parsedName = name;
      }
    } else {
      parsedName = name;
    }

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
        ({ name, debtorCode, newNameGTPStatus, newNameCodeGTPStatus }) => {
          if (newNameGTPStatus === statusCodes.REJECTED && isNil(name)) {
            return false;
          }
          if (
            newNameCodeGTPStatus === statusCodes.REJECTED &&
            isNil(debtorCode)
          ) {
            return false;
          }
          return !(
            newNameGTPStatus === statusCodes.NEW ||
            newNameGTPStatus === statusCodes.EDITED ||
            newNameCodeGTPStatus === statusCodes.NEW ||
            newNameCodeGTPStatus === statusCodes.EDITED
          );
        }
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
