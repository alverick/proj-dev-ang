import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockModule, MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { parseParams, ServiceTypes } from '../../../shared/constants/services';
import { IpInfoDataService } from '../../../shared/data';
import {
  CompanyService,
  DigitalDataService,
  EnterpriseHeadingService,
  ServicesFormsService,
} from '../../../shared/services';
import { type ICompanyResult } from '../../../shared/services/company.service';
import { type FingerPrintData } from '../../../shared/services/digital-data.service';
import { LoginService } from '../../../shared/services/login.service';
import { NotifyService } from '../../../shared/services/notify.service';
import {
  type ServiceDebt,
  type ServiceFormValue,
} from '../../../shared/services/services-forms.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AffiliationService } from './affiliation.service';
import { AffiliationFormsService } from './affiliation-forms.service';

const sdkFingerPrintMock: FingerPrintData = {
  Browser: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    browserName: 'Edge',
    browserVersion: '124.0.0.0',
    browserMajor: '124',
    browserEngineName: 'Blink',
    browserEngineVersion: '124.0.0.0',
    osName: 'Mac OS',
    osVersion: '10.15.7',
    deviceVendor: '',
    deviceModel: '',
    deviceType: '',
    cpuArchitecture: '',
    isPrivateMode: '0',
  },
  General: {
    fingerprintVersion: '3.1.1',
    language: 'en-US',
    colorDepth: '24',
    deviceMemory: '8',
    hardwareConcurrency: '12',
    resolution: '5120x1440',
    availableResolution: '5120x1415',
    timezoneOffset: '300',
    sessionStorage: '0',
    cookieEnabled: '1',
    localStorage: '1',
    indexedDb: '0',
    cpuClass: '',
    openDatabase: '0',
    navigatorPlatform: 'MacIntel',
    vendorWebGL: '1',
    rendererVideo: 'ANGLE (Apple, Apple M2 Max, OpenGL 4.1)',
    timeZone: 'GMT-0500 (Peru Standard Time)',
    zone: 'America/Lima',
    UTC: -5,
    ram: '8',
    processorCount: '12',
    videoInput: '1',
    audio: '124.04346607114712',
    canvas: -539804549,
  },
  Personalization: {
    numberPlugins: '5',
    numberFonts: '29',
  },
  Alterations: {
    adblock: '0',
    hasLiedLanguages: '0',
    hasLiedResolution: '0',
    hasLiedOs: '0',
    hasLiedBrowser: '0',
    touchSupport: '0',
  },
  Network: {
    publicIp: '',
    localIp: '',
  },
  Site: {
    host: 'localhost:4200',
    hostName: 'localhost',
    href: 'http://localhost:4200/agregar-servicio/informacion',
    origin: 'http://localhost:4200/empresa-registro',
    pathname: '/agregar-servicio/informacion',
    port: '4200',
    protocol: 'http:',
  },
  Identifiers: {
    cookie: 'b57f259a8d8e6e26cc6ac4b62cb5d977',
    localStorageValue: 'a86a98a04142dca9465e9a3e94e39e50',
    unanimity1:
      'c8c1fea5e124ef540ce2e83b49621b1372c0a56a432fd879743cd4b62298edef',
    unanimity2:
      '8ab1e5b445cbedee54fa2149225bf6e65cd1dba594d40122fbc3daca61d95219',
    unanimity3:
      'e87a511b98e581a0acc2242423b61147fc12451cb796a565fc945ea9a80be46d',
    unanimity4:
      '0a13c6731f76791055ff56387d372509d9cc4ea7ba675ac6d5608f46d669af1b',
    unanimity5:
      'a7b8321c8d2a66e4c6de6886f220c129d83979277afe14ed6065e2335332e72c',
    hash: '2C4CF65733783512.8B1C5C002AE575EF.53',
  },
  Geoip: {
    as: 'AS262210 VIETTEL PERÚ S.A.C.',
    asname: 'VIETTEL PERU S.A.C.',
    callingCode: '51',
    city: 'Trujillo',
    continent: 'South America',
    continentCode: 'SA',
    country: 'Peru',
    countryCode: 'PE',
    countryCode3: 'PER',
    currency: 'PEN',
    currentTime: '2024-03-08T04:31:10-05:00',
    district: '',
    hosting: false,
    isp: 'VIETTEL PERÚ S.A.C.',
    lat: -8.1191,
    lon: -79.0355,
    mobile: true,
    offset: -18000,
    org: 'VIETTEL PERÚ S.A.C',
    proxy: false,
    query: '181.176.225.62',
    region: 'LAL',
    regionName: 'La Libertad',
    reverse: '',
    status: 'success',
    timezone: 'America/Lima',
    zip: '',
  },
};

const mockValidateCompany: ICompanyResult = {
  id: 3000,
  success: true,
  code: 1,
  message: 'El Ruc ya se encuentra registrado',
  tradeName: 'Nombre empresa trade',
  fullName: 'Nombre empresa full',
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
          })
        ),
      ],
      providers: [
        AffiliationFormsService,
        AffiliationService,
        MockProvider(CompanyService, {
          validateCompany: () => of(mockValidateCompany),
          saveCompany: () => of(mockValidateCompany),
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
        mockValidateCompany.tradeName
      );
      expect(service.authForm.getRawValue().nameSelect).toEqual('tradeName');
      done();
    });
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
