import {
  type ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MockBuilder } from 'ng-mocks';
import { clone } from 'ramda';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { appFullRoutingNames } from '../../../../app-routing.names';
import { type IServiceRemoteModel } from '../../../../shared/models';
import { type IAccountStateDetails } from '../../../../shared/models/company';
import { type ICompanyData } from '../../../../shared/models/company-data';
import { type DataServiceGTP } from '../../../../shared/models/data-service-gtp';
import {
  type GtpEmpresa,
  type GtpServcegtp,
} from '../../../../shared/models/gtp-post';
import { GtpService } from '../../../../shared/services/gtp.service';
import { AprobacionesPage } from './aprobaciones.page';

jest.mock('sweetalert2', () => ({
  mixin: jest.fn(),
  fire: jest.fn(),
  DismissReason: {
    cancel: 'cancel',
  },
}));

jest.mock('../../../../shared/utils/helpers/popups', () => ({
  swalAlert: {
    fire: jest.fn(),
  },
}));

const SwalMock = Swal as jest.Mocked<typeof Swal>;

const swalAlertMock = jest.requireMock(
  '../../../../shared/utils/helpers/popups',
).swalAlert;

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
    entry: '18',
    email: '',
    movilNumber: '',
    movilOperator: '',
    newName: '',
    uniqueCodeIBK: '',
  };

  const mockServiceData1: DataServiceGTP = {
    accountNumber: '',
    amount: 0,
    chargeInterest: '',
    chargeType: 0,
    currency: '',
    currencySymbol: '',
    dataType: '',
    debtorCode: '',
    idAccount: '',
    interestType: '',
    partialPayment: '',
    paymentType: '',
    porcentage: 0,
    status: '',
    useAgent: false,
    useAppWeb: false,
    useStore: false,
    id: 1,
    name: 'Service 1',
    newName: 'Service 1 New',
    newNameGTPStatus: 2,
    acceptednewName: null,
    newNameCode: 'S1N',
    newNameCodeGTPStatus: 0,
    acceptednewNameCode: null,
    res: '18123',
    inReview: true,
    useAgencyChannel: false,
  };

  const mockServiceData2: DataServiceGTP = {
    accountNumber: '',
    amount: 0,
    chargeInterest: '',
    chargeType: 0,
    currency: '',
    currencySymbol: '',
    dataType: '',
    debtorCode: '',
    idAccount: '',
    interestType: '',
    partialPayment: '',
    paymentType: '',
    porcentage: 0,
    status: '',
    useAgent: false,
    useAppWeb: false,
    useStore: false,
    id: 2,
    name: 'Service 2',
    newName: 'Service 2',
    newNameGTPStatus: 1,
    acceptednewName: true,
    newNameCode: 'S2',
    newNameCodeGTPStatus: 1,
    acceptednewNameCode: true,
    res: '18456',
    inReview: false,
    useAgencyChannel: false,
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
      percentage: 0,
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

  const mockEmpData: GtpEmpresa = { ClientId: 123, NombreAprobado: true };
  const mockScvData: GtpServcegtp[] = [
    {
      ServiceId: 1,
      NombreAprobado: null,
      NombreCodAprobado: null,
      Res: 'AB123',
    },
  ];

  let mensajeSpy: jest.SpyInstance;
  let saveApprovedDataSpy: jest.SpyInstance;
  let saveQueryFixDataSpy: jest.SpyInstance;
  let saveCompanyDataSpy: jest.SpyInstance;
  let ocultarFormularioSpy: jest.SpyInstance;
  let ocultarFormularioSerSpy: jest.SpyInstance;

  beforeEach(async () => {
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
      services: [...mockServicesData],
      GetEnterpriseGtp: jest
        .fn()
        .mockReturnValue(of(clone(mockEnterpriseData))),
      AprobarEmpresaServ: jest.fn().mockReturnValue(of(true)),
      saveDatosEmpresa: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<GtpService>;

    await MockBuilder(AprobacionesPage)
      .mock(Router, mockRouter)
      .mock(ActivatedRoute, mockActivatedRoute)
      .mock(GtpService, mockGtpService);

    fixture = TestBed.createComponent(AprobacionesPage);
    component = fixture.componentInstance;

    component.Enterprise = clone(mockEnterpriseData);
    component.gtpService.services = [
      clone(mockServiceData1),
      clone(mockServiceData2),
    ];
    component.llave = '123';
    component.emp = clone(mockEmpData);
    component.scv = clone(mockScvData);
    component.enterpriseChanged = false;
    component.servicesChanged = false;
    component.Empgtp = clone(mockEnterpriseData);
    mensajeSpy = jest.spyOn(component, 'mensaje');
    saveApprovedDataSpy = jest
      .spyOn(component, 'saveApprovedData')
      .mockImplementation();
    saveQueryFixDataSpy = jest
      .spyOn(component as any, 'saveQueryFixData')
      .mockResolvedValue(undefined);
    saveCompanyDataSpy = jest
      .spyOn(component as any, 'saveCompanyData')
      .mockResolvedValue(undefined);

    ocultarFormularioSpy = jest
      .spyOn(component, 'OcultarFormulario')
      .mockImplementation();
    ocultarFormularioSerSpy = jest
      .spyOn(component, 'OcultarFormularioSer')
      .mockImplementation();

    SwalMock.fire.mockClear();
    mockRouter.navigate.mockClear();
    mensajeSpy.mockClear();
    saveApprovedDataSpy.mockClear();
    saveQueryFixDataSpy.mockClear();
    saveCompanyDataSpy.mockClear();
    ocultarFormularioSpy.mockClear();
    ocultarFormularioSerSpy.mockClear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values after ngOnInit', () => {
    fixture.detectChanges();
    expect(component.llave).toBe('123');
    expect(component.Formulario).toBe(false);
    expect(component.ServiciosFormulario).toBe(false);
    expect(component.stateDetail).toEqual(mockState);
  });

  it('should call loadEnterpriseData on init', () => {
    const loadSpy = jest.spyOn(component, 'loadEnterpriseData');
    fixture.detectChanges();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should load enterprise data', () => {
    const getInfoSpy = jest.spyOn(component, 'getInfoEmpresa');
    component.llave = '123';
    component.loadEnterpriseData();
    expect(mockGtpService.GetServicesGtp).toHaveBeenCalledWith('123');
    expect(getInfoSpy).toHaveBeenCalled();
    expect(mockGtpService.GetEnterpriseGtp).toHaveBeenCalledWith('123');
  });

  it('should set Enterprise and rubro in getInfoEmpresa', fakeAsync(() => {
    const testEnterprise = {
      ...mockEnterpriseData,
      entryName: 'Fetched Entry Name',
    };
    mockGtpService.GetEnterpriseGtp.mockReturnValue(of(testEnterprise));
    component.llave = '123';
    component.getInfoEmpresa();
    tick();
    expect(component.Enterprise).toEqual(testEnterprise);
    expect(component.rubro).toBe('Fetched Entry Name');
  }));

  it('should handle onGrabar', () => {
    fixture.detectChanges();
    const initialEnterprise = clone(component.Enterprise);
    const updatedData = { ...initialEnterprise, name: 'Updated name' };

    component.Formulario = true;
    component.enterpriseChanged = false;

    component.onGrabar(updatedData);

    expect(component.Formulario).toBe(false);
    expect(component.enterpriseChanged).toBe(true);
    expect(component.Enterprise).toEqual(updatedData);
  });

  it('should handle onGrabarSer when data changes', () => {
    fixture.detectChanges();
    component.gtpService.services = [
      clone(mockServiceData1),
      clone(mockServiceData2),
    ];
    const updatedService = { ...mockServiceData1, name: 'Super Service 1' };

    component.indiceActual = 0;
    component.ServiciosFormulario = true;
    component.servicesChanged = false;

    component.onGrabarSer(updatedService);

    expect(component.ServiciosFormulario).toBe(false);
    expect(component.servicesChanged).toBe(true);
    expect(component.Service).toEqual(updatedService);
    expect(component.gtpService.services[0]).toEqual(updatedService);
    expect(component.indiceActual).toBe(-1);
  });

  it('should NOT handle onGrabarSer when data is the same', () => {
    fixture.detectChanges();
    component.gtpService.services = [
      clone(mockServiceData1),
      clone(mockServiceData2),
    ];
    const sameService = clone(mockServiceData1);
    component.indiceActual = 0;
    component.ServiciosFormulario = true;
    component.servicesChanged = false;

    component.onGrabarSer(sameService);

    expect(component.ServiciosFormulario).toBe(true);
    expect(component.servicesChanged).toBe(false);
    expect(component.Service).toBeUndefined();
    expect(component.gtpService.services[0]).toEqual(sameService);
    expect(component.indiceActual).toBe(0);
  });

  it('should handle VerCamposEnterprise', () => {
    fixture.detectChanges();
    const testData = clone(mockEnterpriseData);
    component.ServiciosFormulario = false;
    component.Formulario = false;

    component.VerCamposEnterprise(testData);

    expect(component.Formulario).toBe(true);
    expect(component.Empgtp).toEqual(testData);
  });

  it('should handle VerCamposEnterprise when ServiciosFormulario is true', () => {
    fixture.detectChanges();
    const mensajeSpy = jest.spyOn(component, 'mensaje');
    component.ServiciosFormulario = true;
    component.Formulario = false;

    component.VerCamposEnterprise(mockEnterpriseData);

    expect(mensajeSpy).toHaveBeenCalledWith(
      'Aprobando Servicio ',
      'Actualmente se esta aprobando un Servicio',
    );
    expect(component.Formulario).toBe(false);
  });

  it('should handle VerCamposSer', () => {
    fixture.detectChanges();
    const testService = clone(mockServiceData1);
    component.Formulario = false;
    component.ServiciosFormulario = false;
    component.Enterprise = clone(mockEnterpriseData);
    component.Enterprise.useAgencyChannel = true;
    component.VerCamposSer(testService, 0);

    expect(component.ServiciosFormulario).toBe(true);
    expect(component.Servgtp).toEqual({
      ...testService,
      useAgencyChannel: true,
    });
    expect(component.Servgtp).not.toBe(testService);
    expect(component.indiceActual).toBe(0);
  });

  it('should handle VerCamposSer when Formulario is true', () => {
    fixture.detectChanges();
    const mensajeSpy = jest.spyOn(component, 'mensaje');
    component.Formulario = true;
    component.ServiciosFormulario = false;

    component.VerCamposSer(mockServiceData1, 0);

    expect(mensajeSpy).toHaveBeenCalledWith(
      'Aprobando Empresa',
      'Actualmente se esta aprobando una Empresa',
    );
    expect(component.ServiciosFormulario).toBe(false);
  });

  it('should handle EnviarAprobados (basic call)', () => {
    fixture.detectChanges();
    const processSpy = jest
      .spyOn(component as any, 'processDataEnterprise')
      .mockImplementation();
    component.Enterprise = clone(mockEnterpriseData);
    component.gtpService.services = [
      clone(mockServiceData1),
      clone(mockServiceData2),
    ];
    component.EnviarAprobados();

    expect(processSpy).toHaveBeenCalled();
  });

  describe('OcultarFormularioSer', () => {
    beforeEach(() => {
      component.Servgtp = clone(mockServiceData1);
      component.ServiciosFormulario = true;
      component.indiceActual = 0;
      SwalMock.fire.mockClear();
      ocultarFormularioSerSpy.mockRestore();
    });

    it.each([
      [0, 1],
      [1, 0],
      [2, 1],
      [1, 2],
    ])(
      'should show Swal if Servgtp status requires it (nameStatus=%p, codeStatus=%p)',
      fakeAsync((nameStatus, codeStatus) => {
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        component.Servgtp.newNameGTPStatus = nameStatus;
        component.Servgtp.newNameCodeGTPStatus = codeStatus;
        component.OcultarFormularioSer();
        tick();
        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Descartar Cambios' }),
        );
      }),
    );

    it('should set ServiciosFormulario to false and reset indiceActual if Swal is confirmed', fakeAsync(() => {
      SwalMock.fire.mockResolvedValueOnce({
        isConfirmed: true,
        value: true,
        isDismissed: false,
        isDenied: false,
      });
      component.Servgtp.newNameGTPStatus = 2;
      component.OcultarFormularioSer();
      tick();
      expect(component.ServiciosFormulario).toBe(false);
      expect(component.indiceActual).toBe(-1);
    }));

    it('should NOT change state if Swal is cancelled', fakeAsync(() => {
      SwalMock.fire.mockResolvedValueOnce({
        isConfirmed: false,
        isDismissed: true,
        isDenied: false,
      });
      component.Servgtp.newNameGTPStatus = 2;
      component.OcultarFormularioSer();
      tick();
      expect(component.ServiciosFormulario).toBe(true);
      expect(component.indiceActual).toBe(0);
    }));

    it('should set state directly if status does not require Swal', () => {
      component.Servgtp.newNameGTPStatus = 1;
      component.Servgtp.newNameCodeGTPStatus = 1;
      component.OcultarFormularioSer();
      expect(SwalMock.fire).not.toHaveBeenCalled();
      expect(component.ServiciosFormulario).toBe(false);
      expect(component.indiceActual).toBe(-1);
    });
  });

  describe('mensaje', () => {
    it('should call swalAlert.fire with correct parameters', () => {
      const title = 'Test Title';
      const text = 'Test message text';
      component.mensaje(title, text);
      expect(swalAlertMock.fire).toHaveBeenCalledWith({
        title: title,
        text: text,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        confirmButtonText: 'Cerrar',
      });
    });
  });

  describe('processDataEnterprise', () => {
    it('should call mensaje and return if observations > 0', () => {
      const observations = 1;
      const notApproved = 0;
      saveQueryFixDataSpy = jest
        .spyOn(component as any, 'saveQueryFixData')
        .mockResolvedValue(undefined);
      (component as any).processDataEnterprise(observations, notApproved);

      expect(mensajeSpy).toHaveBeenCalledWith(
        'Aprobación',
        `Aun faltan aprobar ${observations} observaciones`,
      );
      expect(SwalMock.fire).not.toHaveBeenCalled();
      expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
      expect(saveCompanyDataSpy).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    describe('when notApproved > 0', () => {
      const observations = 0;
      const notApproved = 1;

      it('should show rejection Swal for new enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            html: expect.stringContaining('no fueron aprobados'),
            confirmButtonText: 'Si, Rechazar afiliación',
            cancelButtonText: 'No, Solicitar corrección de datos',
          }),
        );
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
        expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
      }));

      it('should call saveApprovedData with Rechaza:true if rejection Swal confirmed for new enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: true,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(saveApprovedDataSpy).toHaveBeenCalledWith({
          Rechaza: true,
          EnterpriseObj: component.emp,
          ListServiceObj: component.scv,
        });
        expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
      }));

      it('should call saveQueryFixData if rejection Swal cancelled for new enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          isDismissed: true,
          dismiss: Swal.DismissReason.cancel,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        tick();
        expect(saveQueryFixDataSpy).toHaveBeenCalledTimes(1);
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      }));

      it('should show correction Swal for existing enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = false;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            html: expect.stringContaining('no fueron aprobados'),
            confirmButtonText: 'Si, Solicitar corrección de datos',
            cancelButtonText: 'No, Cancelar',
          }),
        );
        expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
      }));

      it('should call saveQueryFixData if correction Swal confirmed for existing enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = false;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: true,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        tick();
        expect(saveQueryFixDataSpy).toHaveBeenCalledTimes(1);
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      }));

      it('should do nothing further if correction Swal cancelled for existing enterprise', fakeAsync(() => {
        component.Enterprise.isNewEnterprise = false;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          isDismissed: true,
          dismiss: Swal.DismissReason.cancel,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      }));
    });

    describe('when confirming changes (name===newName, !inReview, !servicesInReview, changed)', () => {
      const observations = 0;
      const notApproved = 0;

      beforeEach(() => {
        component.Enterprise.name = 'Same Name';
        component.Enterprise.newName = 'Same Name';
        component.Enterprise.inReview = false;
        component.gtpService.services.forEach((s) => (s.inReview = false));
      });

      it('should show confirm changes Swal if enterpriseChanged', fakeAsync(() => {
        component.enterpriseChanged = true;
        component.servicesChanged = false;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();

        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Confirmar cambios',
            confirmButtonText: 'Si, Terminar',
          }),
        );
      }));

      it('should show confirm changes Swal if servicesChanged', fakeAsync(() => {
        component.enterpriseChanged = false;
        component.servicesChanged = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();

        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Confirmar cambios',
            confirmButtonText: 'Si, Terminar',
          }),
        );
      }));

      it('should call saveCompanyData if Swal confirmed and enterpriseChanged', fakeAsync(() => {
        component.enterpriseChanged = true;
        component.servicesChanged = false;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: true,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        tick();
        expect(saveCompanyDataSpy).toHaveBeenCalledWith({
          EnterpriseObj: null,
          ListServiceObj: component.scv,
        });
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }));

      it('should call saveApprovedData if Swal confirmed and only servicesChanged', fakeAsync(() => {
        component.enterpriseChanged = false;
        component.servicesChanged = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: true,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(saveApprovedDataSpy).toHaveBeenCalledWith({
          EnterpriseObj: null,
          ListServiceObj: component.scv,
        });
        expect(saveCompanyDataSpy).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }));

      it('should navigate to ADMIN if Swal cancelled', fakeAsync(() => {
        component.enterpriseChanged = true;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: true,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();
        expect(mockRouter.navigate).toHaveBeenCalledWith([
          appFullRoutingNames.ADMIN,
        ]);
        expect(saveCompanyDataSpy).not.toHaveBeenCalled();
        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      }));
    });

    it('should navigate to ADMIN if no observations, no rejections, and no changes', () => {
      const observations = 0;
      const notApproved = 0;
      component.enterpriseChanged = false;
      component.servicesChanged = false;

      (component as any).processDataEnterprise(observations, notApproved);

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        appFullRoutingNames.ADMIN,
      ]);
      expect(SwalMock.fire).not.toHaveBeenCalled();
      expect(saveApprovedDataSpy).not.toHaveBeenCalled();
      expect(saveCompanyDataSpy).not.toHaveBeenCalled();
      expect(saveQueryFixDataSpy).not.toHaveBeenCalled();
    });

    describe('when terminating (default else case)', () => {
      const observations = 0;
      const notApproved = 0;

      beforeEach(() => {
        component.enterpriseChanged = true;
      });

      it('should show termination Swal', fakeAsync(() => {
        component.Enterprise.name = 'Different Name';
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();

        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Aprobación',
            html: expect.stringContaining(
              'Todos los campos han sido revisados',
            ),
            confirmButtonText: 'Si, Terminar',
          }),
        );
      }));

      it('should return if termination Swal cancelled', fakeAsync(() => {
        component.Enterprise.name = 'Different Name';
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        (component as any).processDataEnterprise(observations, notApproved);
        tick();

        expect(saveApprovedDataSpy).not.toHaveBeenCalled();
        expect(saveCompanyDataSpy).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }));

      describe('when termination Swal confirmed', () => {
        beforeEach(() => {
          SwalMock.fire.mockResolvedValueOnce({
            isConfirmed: true,
            value: true,
            isDismissed: false,
            isDenied: false,
          });
        });

        describe('and name === newName', () => {
          beforeEach(() => {
            component.Enterprise.name = 'Same Name';
            component.Enterprise.newName = 'Same Name';
          });

          it('should navigate to ADMIN if !inReview and scv is empty', fakeAsync(() => {
            component.Enterprise.inReview = false;
            component.scv = [];
            (component as any).processDataEnterprise(observations, notApproved);
            tick();

            expect(mockRouter.navigate).toHaveBeenCalledWith([
              appFullRoutingNames.ADMIN,
            ]);
            expect(saveApprovedDataSpy).not.toHaveBeenCalled();
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          }));

          it('should call saveCompanyData if !inReview, scv not empty, and enterpriseChanged', fakeAsync(() => {
            component.Enterprise.inReview = false;
            component.scv = clone(mockScvData);
            component.enterpriseChanged = true;

            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            tick();
            expect(saveCompanyDataSpy).toHaveBeenCalledWith({
              EnterpriseObj: null,
              ListServiceObj: component.scv,
            });
            expect(saveApprovedDataSpy).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }));

          it('should call saveApprovedData if !inReview, scv not empty, and !enterpriseChanged', fakeAsync(() => {
            component.Enterprise.inReview = false;
            component.scv = clone(mockScvData);
            component.enterpriseChanged = false;
            component.servicesChanged = true;

            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            expect(saveApprovedDataSpy).toHaveBeenCalledWith({
              EnterpriseObj: null,
              ListServiceObj: component.scv,
            });
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }));

          it('should call saveApprovedData if inReview and scv not empty', fakeAsync(() => {
            component.Enterprise.inReview = true;
            component.scv = clone(mockScvData);
            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            expect(saveApprovedDataSpy).toHaveBeenCalledWith({
              EnterpriseObj: component.emp,
              ListServiceObj: component.scv,
            });
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }));

          it('should do nothing if inReview and scv is empty', fakeAsync(() => {
            component.Enterprise.inReview = true;
            component.scv = [];
            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            expect(saveApprovedDataSpy).toHaveBeenCalled();
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
          }));
        });

        describe('and name !== newName', () => {
          beforeEach(() => {
            component.Enterprise.name = 'Old Name';
            component.Enterprise.newName = 'New Name';
          });

          it('should call saveApprovedData with null ListServiceObj if scv is empty', fakeAsync(() => {
            component.scv = [];
            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            expect(saveApprovedDataSpy).toHaveBeenCalledWith({
              EnterpriseObj: component.emp,
              ListServiceObj: null,
            });
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          }));

          it('should call saveApprovedData with scv if scv is not empty', fakeAsync(() => {
            component.scv = clone(mockScvData);
            (component as any).processDataEnterprise(observations, notApproved);
            tick();
            expect(saveApprovedDataSpy).toHaveBeenCalledWith({
              EnterpriseObj: component.emp,
              ListServiceObj: component.scv,
            });
            expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          }));
        });
      });
    });
  });

  describe('saveQueryFixData', () => {
    describe('when enterpriseChanged is true and inReview is false', () => {
      beforeEach(() => {
        component.enterpriseChanged = true;
        component.Enterprise.inReview = false;
        saveQueryFixDataSpy.mockRestore();
      });

      it('should call saveCompanyData', fakeAsync(() => {
        (component as any).saveQueryFixData();
        tick();
        expect(saveCompanyDataSpy).toHaveBeenCalledTimes(1);
      }));

      it('should THEN call saveApprovedData based on name/inReview/scv state (e.g., name !== newName, scv not empty)', (done) => {
        component.enterpriseChanged = false;
        component.Enterprise = { name: 'A', newName: 'B' } as ICompanyData;
        component.scv = [{ ServiceId: 1 }] as GtpServcegtp[];
        component.emp = { ClientId: 1 } as GtpEmpresa;
        (component as any).saveQueryFixData().then(() => {
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: component.scv,
          });
          done();
        });
      });

      it('should THEN call saveApprovedData based on name/inReview/scv state (e.g., name === newName, !inReview, scv empty)', (done) => {
        component.Enterprise.name = 'Same Name';
        component.Enterprise.newName = 'Same Name';
        component.Enterprise.inReview = false;
        component.scv = [];
        (component as any).saveQueryFixData().then(() => {
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: [],
          });
          done();
        });
      });

      it('should THEN call saveApprovedData based on name/inReview/scv state (e.g., name === newName, !inReview, scv not empty)', (done) => {
        component.Enterprise.name = 'Same Name';
        component.Enterprise.newName = 'Same Name';
        component.Enterprise.inReview = false;
        component.scv = clone(mockScvData);
        (component as any).saveQueryFixData().then(() => {
          expect(saveCompanyDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: null,
            ListServiceObj: component.scv,
          });
          done();
        });
      });
    });
    describe('when enterpriseChanged is false or inReview is true', () => {
      beforeEach(() => {
        saveQueryFixDataSpy.mockRestore();
      });
      it('should NOT call saveCompanyData if enterpriseChanged is false', fakeAsync(() => {
        component.enterpriseChanged = false;
        component.Enterprise.inReview = false;
        (component as any).saveQueryFixData();
        tick();

        expect(saveCompanyDataSpy).not.toHaveBeenCalled();
      }));

      it('should NOT call saveCompanyData if inReview is true', fakeAsync(() => {
        component.enterpriseChanged = true;
        component.Enterprise.inReview = true;

        (component as any).saveQueryFixData();
        tick();

        expect(saveCompanyDataSpy).not.toHaveBeenCalled();
      }));

      describe('and name === newName', () => {
        beforeEach(() => {
          component.Enterprise.name = 'Same Name';
          component.Enterprise.newName = 'Same Name';
          component.enterpriseChanged = false;
        });

        it('should call saveApprovedData with emp if (!inReview and scv empty)', fakeAsync(() => {
          component.Enterprise.inReview = false;
          component.scv = [];

          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: [],
          });
        }));

        it('should call saveApprovedData with emp if (inReview and scv not empty)', fakeAsync(() => {
          component.Enterprise.inReview = true;
          component.scv = clone(mockScvData);

          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: component.scv,
          });
        }));

        it('should call saveApprovedData with null EnterpriseObj if (!inReview and scv not empty)', fakeAsync(() => {
          component.Enterprise.inReview = false;
          component.scv = clone(mockScvData);

          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: null,
            ListServiceObj: component.scv,
          });
        }));

        it('should fall through and call saveApprovedData if (inReview and scv empty)', fakeAsync(() => {
          component.Enterprise.inReview = true;
          component.scv = [];
          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: null,
          });
        }));
      });

      describe('and name !== newName', () => {
        beforeEach(() => {
          component.Enterprise.name = 'Old Name';
          component.Enterprise.newName = 'New Name';
          component.enterpriseChanged = false;
        });

        it('should call saveApprovedData with null ListServiceObj if scv is empty', fakeAsync(() => {
          component.scv = [];

          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: null,
          });
        }));

        it('should call saveApprovedData with scv if scv is not empty', fakeAsync(() => {
          component.scv = clone(mockScvData);

          (component as any).saveQueryFixData();
          tick();

          expect(saveCompanyDataSpy).not.toHaveBeenCalled();
          expect(saveApprovedDataSpy).toHaveBeenCalledTimes(1);
          expect(saveApprovedDataSpy).toHaveBeenCalledWith({
            Rechaza: false,
            EnterpriseObj: component.emp,
            ListServiceObj: component.scv,
          });
        }));
      });
    });
  });

  describe('hidePanel', () => {
    it('should call OcultarFormulario if Formulario is true', () => {
      component.Formulario = true;
      component.ServiciosFormulario = false;
      component.hidePanel();
      expect(ocultarFormularioSpy).toHaveBeenCalledTimes(1);
      expect(ocultarFormularioSerSpy).not.toHaveBeenCalled();
    });

    it('should call OcultarFormularioSer if ServiciosFormulario is true', () => {
      component.Formulario = false;
      component.ServiciosFormulario = true;
      component.hidePanel();
      expect(ocultarFormularioSpy).not.toHaveBeenCalled();
      expect(ocultarFormularioSerSpy).toHaveBeenCalledTimes(1);
    });

    it('should call both if both Formulario and ServiciosFormulario are true', () => {
      component.Formulario = true;
      component.ServiciosFormulario = true;
      component.hidePanel();
      expect(ocultarFormularioSpy).toHaveBeenCalledTimes(1);
      expect(ocultarFormularioSerSpy).toHaveBeenCalledTimes(1);
    });

    it('should call neither if both Formulario and ServiciosFormulario are false', () => {
      component.Formulario = false;
      component.ServiciosFormulario = false;
      component.hidePanel();
      expect(ocultarFormularioSpy).not.toHaveBeenCalled();
      expect(ocultarFormularioSerSpy).not.toHaveBeenCalled();
    });
  });

  describe('OcultarFormulario', () => {
    beforeEach(() => {
      component.Formulario = true;
      component.Empgtp = clone(mockEnterpriseData);
      SwalMock.fire.mockClear();
      ocultarFormularioSpy.mockRestore();
    });

    it.each([[0], [2]])(
      'should show Swal confirmation when Empgtp.newNameGTPStatus is %p',
      fakeAsync((status) => {
        component.Empgtp.newNameGTPStatus = status;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: false,
          value: false,
          isDismissed: false,
          isDenied: false,
        });
        component.OcultarFormulario();
        tick();
        expect(SwalMock.fire).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Descartar Cambios' }),
        );
        expect(component.Formulario).toBe(true);
      }),
    );

    it.each([[0], [2]])(
      'should hide Formulario if Swal is confirmed when Empgtp.newNameGTPStatus is %p',
      fakeAsync((status) => {
        component.Empgtp.newNameGTPStatus = status;
        SwalMock.fire.mockResolvedValueOnce({
          isConfirmed: true,
          value: true,
          isDismissed: false,
          isDenied: false,
        });
        component.OcultarFormulario();
        tick();
        expect(SwalMock.fire).toHaveBeenCalledTimes(1);
        expect(component.Formulario).toBe(false);
      }),
    );

    it.each([[1], [3], [-1], [null], [undefined]])(
      'should hide Formulario directly without Swal when Empgtp.newNameGTPStatus is %p',
      (status) => {
        component.Empgtp.newNameGTPStatus = status;

        component.OcultarFormulario();

        expect(SwalMock.fire).not.toHaveBeenCalled();
        expect(component.Formulario).toBe(false);
      },
    );

    it('should handle case where Empgtp might be null (defensive check)', () => {
      component.Empgtp = null;
      expect(() => component.OcultarFormulario()).toThrowError();
    });
  });

  describe('@HostListener(window:beforeunload)', () => {
    let mockEvent: BeforeUnloadEvent;
    let preventDefaultSpy: jest.SpyInstance;

    beforeEach(() => {
      mockEvent = {
        preventDefault: () => {},
        returnValue: '',
      } as BeforeUnloadEvent;
      preventDefaultSpy = jest.spyOn(mockEvent, 'preventDefault');
    });

    it('should call event.preventDefault() if Formulario and ServiciosFormulario are true', () => {
      component.Formulario = true;
      component.ServiciosFormulario = true;
      component.closeWindow(mockEvent);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT call event.preventDefault() if Formulario is false', () => {
      component.Formulario = false;
      component.ServiciosFormulario = true;
      component.closeWindow(mockEvent);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should NOT call event.preventDefault() if ServiciosFormulario is false', () => {
      component.Formulario = true;
      component.ServiciosFormulario = false;
      component.closeWindow(mockEvent);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should NOT call event.preventDefault() if both are false', () => {
      component.Formulario = false;
      component.ServiciosFormulario = false;
      component.closeWindow(mockEvent);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
