import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockInstance, MockProvider } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';
import { of, throwError } from 'rxjs';

import {
  chargeTypeOptions,
  dataTypeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../shared/constants/services';
import { type IServiceRemoteModel } from '../../../shared/models';
import {
  CompanyService,
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
  TrackingService,
} from '../../../shared/services';
import {
  type ServiceConfigurationForm,
  type ServiceFormValue,
} from '../../../shared/services/services-forms.service';
import { AdobeEvent } from '../../../shared/services/tracking.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { CompanyServicesService } from './company-services.service';

describe('CompanyServicesService', () => {
  let service: CompanyServicesService;
  let companyServiceSpy: jest.Mocked<CompanyService>;
  let digitalDataSpy: jest.Mocked<DigitalDataService>;
  let trackingSpy: jest.Mocked<TrackingService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    MockInstance(ServicesFormsService, 'setEditFormValidator', jest.fn());
    MockInstance(ServiceService, 'checkCanDeleteService', jest.fn());
    MockInstance(ServiceService, 'deleteService', jest.fn());
    MockInstance(NGXLogger, 'log', jest.fn());
    MockInstance(DigitalDataService, 'getData$', jest.fn());
    MockInstance(TrackingService, 'trackEvent', jest.fn());
    jest.spyOn(swalAlert, 'fire').mockResolvedValue({} as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CompanyServicesService,
        MockProvider(CompanyService),
        ServicesFormsService,
        MockProvider(ServiceService),
        MockProvider(NGXLogger),
        MockProvider(DigitalDataService),
        MockProvider(TrackingService),
      ],
    });

    service = TestBed.inject(CompanyServicesService);
    companyServiceSpy = TestBed.inject(
      CompanyService,
    ) as jest.Mocked<CompanyService>;
    digitalDataSpy = TestBed.inject(
      DigitalDataService,
    ) as jest.Mocked<DigitalDataService>;
    trackingSpy = TestBed.inject(
      TrackingService,
    ) as jest.Mocked<TrackingService>;

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  afterEach(() => {
    MockInstance.restore();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch company services', () => {
    const mockServices: IServiceRemoteModel[] = [
      {
        id: 1,
        name: 'Service A',
        currency: '001',
        dataType: 'C',
        debtorCode: 'DNI',
        idAccount: '223123',
        paymentType: 'S',
      },
      {
        id: 2,
        name: 'Service B',
        currency: '001',
        dataType: 'C',
        debtorCode: 'DNI',
        idAccount: '223123',
        paymentType: 'S',
      },
    ];

    companyServiceSpy.getCompanyServices.mockReturnValue(of(mockServices));
    service.getServices().subscribe((services) => {
      expect(services.length).toBe(2);
      expect(services).toEqual(mockServices);
    });
  });

  it('should handle errors gracefully', () => {
    const mockError = new Error('Simulated fetch error');
    companyServiceSpy.getCompanyServices.mockReturnValue(
      throwError(() => mockError),
    );
    service.getServices().subscribe(
      () => fail('Expected error, but got success response'),
      (error) => {
        expect(error).toBeTruthy();
      },
    );
  });

  describe('saveService', () => {
    it('should save a new service and track event', (done) => {
      const mockServiceFormValue: ServiceFormValue = {
        account: 'asdf24',
        useAppWeb: false,
        idAccount: '1',
        name: 'Test Service',
        useAgent: true,
        accountNumber: '12345',
        currency: 'USD',
      };
      const mockServiceConfigFormValue: ServiceConfigurationForm = {
        dataType: 'S',
        debtorCode: '123',
        debtorCodeCustom: 'custom123',
        debt: {
          paymentType: 'C',
          partialPayment: 'N',
          chargeInterest: 'S',
          chargeType: '1',
          interestType: 'M',
          amount: '10.00',
        },
      };
      const mockSdk = { sdk: 'test' };
      service.serviceForm.patchValue(mockServiceFormValue);
      service.serviceConfigForm.patchValue(mockServiceConfigFormValue);
      (digitalDataSpy.getData$ as jest.Mock).mockReturnValue(of(mockSdk));
      (companyServiceSpy.saveServices as jest.Mock).mockReturnValue(of({}));

      service.saveService().subscribe(() => {
        expect(service.services.length).toBe(1);
        expect(trackingSpy.trackEvent).toHaveBeenCalledWith(
          AdobeEvent.trackFormSubmit,
          {
            action: 'Click',
            category: 'Servicios agregar nuevo servicio',
            label: 'Siguiente',
            location: 'Servicios agregar',
            metadata: [
              {
                key: 'Tipo de servicio',
                value: dataTypeOptions.find((item) => item.value === 'S')
                  ?.label,
              },
              {
                key: 'Codigo cliente',
                value: 'custom123',
              },
              {
                key: 'Orden a pagar',
                value: paymentTypeOptions.find((item) => item.value === 'C')
                  ?.label,
              },
              {
                key: 'Pago parcial',
                value: 'false',
              },
              {
                key: 'Pago mora',
                value: 'true',
              },
              {
                key: 'Tipo cobro',
                value: chargeTypeOptions.find((item) => item.value === '1')
                  ?.label,
              },
              {
                key: 'Tipo calculo',
                value: interestTypeOptions.find((item) => item.value === 'M')
                  ?.label,
              },
              {
                key: 'Monto',
                value: '10.00',
              },
            ],
            state: 'Envío exitoso',
            step: 'Step2',
          },
        );
        expect(companyServiceSpy.saveServices).toHaveBeenCalled();
        done();
      });
    });
  });
});
