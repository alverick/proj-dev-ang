import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockModule, MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { lastValueFrom, of, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { affiliationModalMessageNotAvailable } from '../../../shared/constants/modal-data';
import { parseParams, ServiceTypes } from '../../../shared/constants/services';
import { IpInfoDataService } from '../../../shared/data';
import {
  mockValidateCompany,
  sdkFingerPrintMock,
  updateCompanyMock,
} from '../../../shared/mocks/affiliation';
import {
  CompanyService,
  DigitalDataService,
  EnterpriseHeadingService,
  ServicesFormsService,
} from '../../../shared/services';
import { LoginService } from '../../../shared/services/login.service';
import { NotifyService } from '../../../shared/services/notify.service';
import {
  type ServiceDebt,
  type ServiceFormValue,
} from '../../../shared/services/services-forms.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AdobeEvent } from '../../../shared/services/tracking.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { AffiliationService } from './affiliation.service';
import { AffiliationFormsService } from './affiliation-forms.service';

const swalAlertMock = {
  value: true,
  isConfirmed: true,
  isDenied: false,
  isDismissed: false,
};

describe('AffiliationService', () => {
  let service: AffiliationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MockModule(
          LoggerModule.forRoot({
            level: environment.logLevel,
            serverLogLevel: environment.serverLogLevel,
            disableConsoleLogging: false,
            enableSourceMaps: true,
          }),
        ),
      ],
      providers: [
        AffiliationFormsService,
        AffiliationService,
        MockProvider(CompanyService, {
          validateCompany: () => of(mockValidateCompany),
          saveCompany: () => of(mockValidateCompany),
          sendUpdateCompanyData: jest.fn(),
          saveServices: () => of(mockValidateCompany),
        }),
        MockProvider(DigitalDataService, {
          getData$: () => of(sdkFingerPrintMock),
        }),
        EnterpriseHeadingService,
        FormBuilder,
        IpInfoDataService,
        MockProvider(LoginService),
        NotifyService,
        ServicesFormsService,
        StorageService,
      ],
    });

    jest.spyOn(swalAlert, 'fire').mockResolvedValue(swalAlertMock);

    service = TestBed.inject(AffiliationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.registerForm).toEqual(service.affiliationForms.registerForm);
    expect(service.authForm).toEqual(service.affiliationForms.authForm);
  });

  it('setEditForm', () => {
    const serviceDebt: Partial<ServiceDebt> & { dataType: string } = {
      dataType: 'S',
      paymentType: 'string',
      chargeInterest: 'string',
      chargeType: '0',
      interestType: 'string',
      amount: '0.00',
      partialPayment: 'string',
    };
    const serviceData = {
      name: 'Servicio 1',
      debtorCode: 'DNI',
      currency: 'string',
      useAppWeb: true,
      useAgent: true,
      inReview: true,
      newNameCode: 'Codigo',
      newNameCodeGTPStatus: 3,
      newName: 'Servicio 1 mod',
      newNameGTPStatus: 3,
    };
    const serviceDataAdd = {
      res: '234333',
      idAccount: '4234234234234234',
      accountNumber: '324234234234',
      useStore: true,
      amount: 0,
      percentage: 0,
      currencySymbol: 'S/',
      status: 'string',
      debtorCodeType: 0,
      useAgencyChannel: true,
    };
    service.servicesList = [
      {
        ...serviceData,
        ...serviceDebt,
        ...serviceDataAdd,
      },
    ];

    const data = service.setEditForm(0);
    expect(data).toEqual({ ...serviceData, debt: serviceDebt });
  });

  it('validateCompany', (done) => {
    const form = {
      ruc: '20213094271',
      email: 'jsuarezq.tcs@outlook.com',
      emailConfirm: 'jsuarezq.tcs@outlook.com',
      movilNumber: '923423423',
      movilOperator: 'M',
      documentType: 'DNI',
      documentNumber: '29837342',
    };
    service.registerForm.setValue(form);

    service.validateCompany().subscribe(({ success }) => {
      expect(success).toEqual(true);
      expect(service.authForm.getRawValue().ruc).toEqual(form.ruc);
      expect(service.authForm.getRawValue().name).toEqual(
        mockValidateCompany.tradeName,
      );
      expect(service.authForm.getRawValue().nameSelect).toEqual('tradeName');
      done();
    });
  });

  it('should show message for existing customer', () => {
    const action = { category: 'test' };
    jest
      .spyOn(service, 'showMessageExistsCustomer')
      .mockImplementation(() => {});
    jest.spyOn(service, 'sendAdobeTrack').mockImplementation(() => {});

    (service as any).processResultCode(1, '', action);

    expect(service.showMessageExistsCustomer).toHaveBeenCalledTimes(1);
    expect(service.sendAdobeTrack).toHaveBeenCalledTimes(2);
    expect(service.sendAdobeTrack).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      {
        ...action,
        typeError:
          'El RUC ingresado ya se encuentra registrado en Cobro Simple.',
      },
    );
  });

  it('should show message for non-existent accounts', () => {
    const action = { category: 'test' };
    jest
      .spyOn(service, 'showMessageNoExistsAccounts')
      .mockImplementation(() => {});
    jest.spyOn(service, 'sendAdobeTrack').mockImplementation(() => {});

    (service as any).processResultCode(2, '', action);

    expect(service.showMessageNoExistsAccounts).toHaveBeenCalledTimes(1);
    expect(service.sendAdobeTrack).toHaveBeenCalledTimes(2);
    expect(service.sendAdobeTrack).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      {
        ...action,
        typeError:
          'Debes tener una cuenta corriente o ahorros persona jurídica.',
      },
    );
  });

  it('should show message for non-existent accounts', () => {
    const action = { category: 'test' };
    jest
      .spyOn(service, 'showMessageNoExistsAccounts')
      .mockImplementation(() => {});
    jest.spyOn(service, 'sendAdobeTrack').mockImplementation(() => {});

    (service as any).processResultCode(3, '', action);

    expect(service.showMessageNoExistsAccounts).toHaveBeenCalledTimes(1);
    expect(service.sendAdobeTrack).toHaveBeenCalledTimes(2);
    expect(service.sendAdobeTrack).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      {
        ...action,
        typeError:
          'Debes tener una cuenta corriente o ahorros persona jurídica.',
      },
    );
  });

  it('should show error server message', () => {
    const action = { category: 'test' };
    jest.spyOn(service, 'showErrorServer').mockImplementation(() => {});
    jest.spyOn(service, 'sendAdobeTrack').mockImplementation(() => {});

    (service as any).processResultCode(5, '', action);

    expect(service.showErrorServer).toHaveBeenCalledTimes(1);
    expect(service.sendAdobeTrack).toHaveBeenCalledTimes(2);
    expect(service.sendAdobeTrack).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      {
        ...action,
        typeError: affiliationModalMessageNotAvailable,
      },
    );
  });

  it('should show error server message with custom message', () => {
    const action = { category: 'test' };
    const message = 'Custom error message';
    jest.spyOn(service, 'showErrorServer').mockImplementation(() => {});
    jest.spyOn(service, 'sendAdobeTrack').mockImplementation(() => {});

    (service as any).processResultCode(6, message, action);

    expect(service.showErrorServer).toHaveBeenCalledTimes(1);
    expect(service.sendAdobeTrack).toHaveBeenCalledTimes(2);
    expect(service.sendAdobeTrack).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      {
        ...action,
        typeError: message,
      },
    );
  });

  it('saveCompany', (done) => {
    const form = {
      ruc: '20213094271',
      email: 'jsuarezq.tcs@outlook.com',
      emailConfirm: 'jsuarezq.tcs@outlook.com',
      movilNumber: '923423423',
      movilOperator: 'M',
      documentType: 'DNI',
      documentNumber: '29837342',
    };
    service.registerForm.setValue(form);

    const formAuth = {
      ruc: '20213094271',
      name: 'Nombre empresa trade',
      nameSelect: 'tradeName',
      entry: '33',
      entrySelect: {
        code: '33',
        name: 'CLUBS CERT II',
      },
      password: '38373we@Q',
      passwordConfirm: '38373we@Q',
      acceptTerms: true,
    };

    service.authForm.setValue(formAuth);

    service.saveCompany().subscribe(({ success }) => {
      expect(success).toEqual(true);
      expect(service.companyId).toEqual(mockValidateCompany.id);
      done();
    });
  });

  it('saveService', (done) => {
    const formRegister = {
      ruc: '20213094271',
      email: 'jsuarezq.tcs@outlook.com',
      emailConfirm: 'jsuarezq.tcs@outlook.com',
      movilNumber: '923423423',
      movilOperator: 'M',
      documentType: 'DNI',
      documentNumber: '29837342',
    };
    service.registerForm.setValue(formRegister);

    const form: ServiceFormValue = {
      name: 'service name',
      account: '*********8180 ( CTA CTE PERSONA JURIDICA - Soles)',
      idAccount: '8180',
      currency: '001',
      accountNumber: '*********8180 (Soles)',
      useAgent: false,
      useAppWeb: true,
    };
    service.serviceForm.setValue(form);

    const formAuth = {
      dataType: ServiceTypes.complete,
      debtorCode: 'DNI',
      debtorCodeCustom: 'empty__',
      debt: {
        paymentType: 'C',
        partialPayment: 'S',
        chargeInterest: 'N',
        chargeType: '',
        interestType: '',
        amount: '',
      },
    };

    service.serviceConfigForm.setValue(formAuth);

    const serviceValues = parseParams({
      debtorCodeCustom: formAuth.debtorCodeCustom,
      debtorCode: formAuth.debtorCode,
      amount: formAuth.debt.amount,
      chargeType: formAuth.debt.chargeType,
      interestType: formAuth.debt.interestType,
    });

    service.saveService();
    expect(service.servicesList[0]).toEqual({
      id: null,
      name: form.name,
      newName: form.name,
      dataType: formAuth.dataType,
      paymentType: formAuth.debt.paymentType,
      idAccount: form.idAccount,
      accountNumber: form.accountNumber,
      currency: form.currency,
      useAppWeb: true,
      useAgent: form.useAgent,
      useStore: false,
      chargeInterest: formAuth.debt.chargeInterest,
      partialPayment: formAuth.debt.partialPayment,
      ...serviceValues,
    });

    service.saveAllServices().subscribe(({ success }) => {
      expect(success).toEqual(true);
      done();
    });
  });

  it('saveService with chargeInterest', (done) => {
    const formRegister = {
      ruc: '20213094271',
      email: 'jsuarezq.tcs@outlook.com',
      emailConfirm: 'jsuarezq.tcs@outlook.com',
      movilNumber: '923423423',
      movilOperator: 'M',
      documentType: 'DNI',
      documentNumber: '29837342',
    };
    service.registerForm.setValue(formRegister);

    const form: ServiceFormValue = {
      name: 'service name',
      account: '*********8180 ( CTA CTE PERSONA JURIDICA - Soles)',
      idAccount: '8180',
      currency: '001',
      accountNumber: '*********8180 (Soles)',
      useAgent: false,
      useAppWeb: true,
    };
    service.serviceForm.setValue(form);

    const formAuth = {
      dataType: ServiceTypes.complete,
      debtorCode: 'DNI',
      debtorCodeCustom: 'empty__',
      debt: {
        paymentType: 'C',
        partialPayment: 'S',
        chargeInterest: 'S',
        chargeType: '1',
        interestType: 'M',
        amount: '2.00',
      },
    };

    service.serviceConfigForm.setValue(formAuth);

    const serviceValues = parseParams({
      debtorCodeCustom: formAuth.debtorCodeCustom,
      debtorCode: formAuth.debtorCode,
      amount: formAuth.debt.amount,
      chargeType: formAuth.debt.chargeType,
      interestType: formAuth.debt.interestType,
    });

    service.saveService();
    expect(service.servicesList[0]).toEqual({
      id: null,
      name: form.name,
      newName: form.name,
      dataType: formAuth.dataType,
      paymentType: formAuth.debt.paymentType,
      idAccount: form.idAccount,
      accountNumber: form.accountNumber,
      currency: form.currency,
      useAppWeb: true,
      useAgent: form.useAgent,
      useStore: false,
      chargeInterest: formAuth.debt.chargeInterest,
      partialPayment: formAuth.debt.partialPayment,
      ...serviceValues,
    });

    service.saveAllServices().subscribe(({ success }) => {
      expect(success).toEqual(true);
      done();
    });
  });

  it('saveAllServices without services', (done) => {
    service.servicesList = [];
    expect(service.servicesList).toEqual([]);

    service.saveAllServices().subscribe({
      error: (err) => {
        expect(err).toEqual('No services');
        done();
      },
    });
  });

  it('should show modal and throw error when newNameGTPStatus is 3 and newName matches authForm value', async () => {
    service.updateData = {
      ...updateCompanyMock,
      newNameGTPStatus: 3,
      newName: 'test',
    };
    service.authForm.get('name').setValue('test');
    await expect(
      lastValueFrom(service.saveUpdateInformation()),
    ).rejects.toEqual('Incomplete data');
    expect(swalAlert.fire).toHaveBeenCalledTimes(1);
  });

  it('should show modal and throw error when any service in servicesList has inReview true and newNameGTPStatus or newNameCodeGTPStatus is 3', async () => {
    service.updateData = {
      ...updateCompanyMock,
      newNameGTPStatus: 3,
      newName: 'test',
    };
    service.servicesList = [
      { inReview: true, newNameGTPStatus: 3, name: 'test', newName: 'test' },
    ];
    await expect(
      lastValueFrom(service.saveUpdateInformation()),
    ).rejects.toEqual('Incomplete data');
    expect(swalAlert.fire).toHaveBeenCalledTimes(1);
  });

  it('should update company data successfully when no modal is shown', (done) => {
    service.updateData = { ...updateCompanyMock, email: 'test@example.com' };
    jest
      .spyOn(service['companyService'], 'sendUpdateCompanyData')
      .mockReturnValue(of(true));

    service.saveUpdateInformation().subscribe((success) => {
      expect(success).toEqual(true);
      expect(service.email).toBe('test@example.com');
      done();
    });
  });

  it('should handle error when company data update fails', async () => {
    service.updateData = { ...updateCompanyMock, email: 'test@example.com' };
    jest
      .spyOn(service['companyService'], 'sendUpdateCompanyData')
      .mockReturnValue(throwError(() => new Error('error')));
    (swalAlert.fire as jest.Mock).mockImplementation(() => {});
    await expect(
      lastValueFrom(service.saveUpdateInformation()),
    ).rejects.toThrow('error');
  });

  it('resetRegistration', () => {
    const formRegister = {
      ruc: '20213094271',
      email: 'jsuarezq.tcs@outlook.com',
      emailConfirm: 'jsuarezq.tcs@outlook.com',
      movilNumber: '923423423',
      movilOperator: 'M',
      documentType: 'DNI',
      documentNumber: '29837342',
    };
    service.registerForm.setValue(formRegister);

    service.resetRegistration();

    expect(service.companyId).toEqual(null);
    expect(service.email).toEqual(formRegister.email);
    expect(service.servicesList).toEqual([]);
  });
});
