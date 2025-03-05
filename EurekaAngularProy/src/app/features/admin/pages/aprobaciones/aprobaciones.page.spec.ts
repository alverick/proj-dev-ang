import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MockBuilder } from 'ng-mocks';
import { of } from 'rxjs';

import { type IServiceRemoteModel } from '../../../../shared/models';
import { type IAccountStateDetails } from '../../../../shared/models/company';
import { type ICompanyData } from '../../../../shared/models/company-data';
import { GtpService } from '../../../../shared/services/gtp.service';
import { AprobacionesPage } from './aprobaciones.page';

describe('AprobacionesPage', () => {
  let component: AprobacionesPage;
  let fixture: ComponentFixture<AprobacionesPage>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockGtpService: jest.Mocked<GtpService>;

  const mockState: IAccountStateDetails = {
    accountStateDetailsResponse: {
      requestDate: '',
      approbationDate: '',
      lastAccess: '',
    },
  };

  const mockEnterpriseData: ICompanyData = {
    name: 'Updated Company',
    entryName: 'Tech',
    ruc: '20394837393',
    entry: '',
    email: '',
    movilNumber: '',
    movilOperator: '',
    newName: '',
    uniqueCodeIBK: '',
  };

  const mockServicesData: IServiceRemoteModel[] = [
    {
      id: 23,
      res: '234333',
      name: 'Servicio 1',
      debtorCode: 'DNI',
      dataType: 'S',
      paymentType: 'string',
      idAccount: '4234234234234234',
      accountNumber: '324234234234',
      currency: 'string',
      useAppWeb: true,
      useAgent: true,
      useStore: true,
      partialPayment: 'string',
      chargeInterest: 'string',
      chargeType: 0,
      interestType: 'string',
      amount: 0,
      currencySymbol: 'S/',
      inReview: true,
      newNameCode: 'Codigo',
      newNameCodeGTPStatus: 3,
      newName: 'Servicio 1 mod',
      newNameGTPStatus: 3,
      status: 'string',
      debtorCodeType: 0,
      useAgencyChannel: true,
    },
  ];

  beforeEach(async () => {
    // Mock the dependencies
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      data: of({
        stateDetail: mockState,
      }),
      snapshot: {
        params: { llave: '123' },
        data: of({
          stateDetail: mockState,
        }),
      },
    } as unknown as jest.Mocked<ActivatedRoute>;

    mockGtpService = {
      GetServicesGtp: jest.fn(),
      services: mockServicesData,
      GetEnterpriseGtp: jest.fn().mockReturnValue(of(mockEnterpriseData)),
    } as unknown as jest.Mocked<GtpService>;

    // Configure the testing module using ng-mocks
    await MockBuilder(AprobacionesPage)
      .mock(Router, mockRouter)
      .mock(ActivatedRoute, mockActivatedRoute)
      .mock(GtpService, mockGtpService);

    fixture = TestBed.createComponent(AprobacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.llave).toBe('123');
    expect(component.Formulario).toBe(false);
    expect(component.ServiciosFormulario).toBe(false);
  });

  it('should load enterprise data', () => {
    component.loadEnterpriseData();
    expect(mockGtpService.GetServicesGtp).toHaveBeenCalledWith('123');
    expect(mockGtpService.GetEnterpriseGtp).toHaveBeenCalledWith('123');
  });

  it('should handle onGrabar', () => {
    component.onGrabar({ ...mockEnterpriseData, name: 'Updated name' });
    expect(component.Formulario).toBe(false);
    expect(component.enterpriseChanged).toBe(true);
  });

  // it('should handle onGrabarSer', () => {
  //   const mockDataServiceGTP = {
  //     /* mock DataServiceGTP */
  //   };
  //   component.indiceActual = 0;
  //   component.onGrabarSer(mockDataServiceGTP);
  //   expect(component.ServiciosFormulario).toBe(false);
  //   expect(component.servicesChanged).toBe(true);
  // });

  it('should handle VerCamposEnterprise', () => {
    component.VerCamposEnterprise(mockEnterpriseData);
    expect(component.Formulario).toBe(true);
  });

  // it('should handle VerCamposSer', () => {
  //   const mockDataServiceGTP = {
  //     /* mock DataServiceGTP */
  //   };
  //   component.VerCamposSer(mockDataServiceGTP, 0);
  //   expect(component.ServiciosFormulario).toBe(true);
  // });

  it('should handle EnviarAprobados', () => {
    component.EnviarAprobados();
    // Add assertions based on the expected behavior of processDataEnterprise
  });
});
