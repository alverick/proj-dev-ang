import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import moment from 'moment';

import { environment } from '../../../environments/environment';
import { type ICompanyData } from '../models/company-data';
import { type CorreoGtpModel } from '../models/data-correoGtp';
import { type DataServiceGTP } from '../models/data-service-gtp';
import { type EnterprisesPagedList } from '../models/enterprises-gtp';
import { type GtpFilter } from '../models/gtp-filter';
import { GtpService } from './gtp.service';

describe('GtpService', () => {
  let service: GtpService;
  let httpMock: HttpTestingController;
  const baseApiUrl = environment.END_POINT;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GtpService],
    });
    service = TestBed.inject(GtpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStates() should return the predefined states as an Observable', (done) => {
    service.getStates().subscribe((states) => {
      expect(states).toBeInstanceOf(Array);
      expect(states.length).toBe(5);
      expect(states[0]).toEqual({
        idState: 'Pendiente',
        descripcion: 'Pendiente',
      });
      expect(states[4]).toEqual({
        idState: 'Desafiliado',
        descripcion: 'Desafiliado',
      });
      done();
    });
  });

  it('getTipoSolicitudes() should return the predefined request types as an Observable', (done) => {
    service.getTipoSolicitudes().subscribe((tipos) => {
      expect(tipos).toBeInstanceOf(Array);
      expect(tipos.length).toBe(4);
      expect(tipos[0]).toEqual({
        idState: 'EmpNuevo',
        descripcion: 'Empresa Nueva',
      });
      expect(tipos[3]).toEqual({
        idState: 'SvcNuevo',
        descripcion: 'Nuevos Servicios',
      });
      done();
    });
  });

  describe('getEmpresas', () => {
    const mockFilter: GtpFilter = {
      pageNumber: 1,
      ColumnName: 'name',
      asc: true,
      inputSearch: 'test',
      BusinessHeading: 'Tech',
      status: ['Pendiente'],
      statusSolicitud: 'EmpNuevo',
      dateFrom: new Date('2023-01-01T00:00:00Z'),
      dateTo: new Date('2023-01-31T23:59:59Z'),
    };

    const mockResponse: EnterprisesPagedList = {
      totalCompanies: 55,
      listCompanyGTP: [{ id: 1, name: 'Test Co' } as any],
    };

    it('should fetch enterprises with a given filter and update properties', (done) => {
      const expectedDateFrom = encodeURI(
        moment(mockFilter.dateFrom).format('DD/MM/YYYY'),
      );
      const expectedDateTo = encodeURI(
        moment(mockFilter.dateTo).format('DD/MM/YYYY'),
      );
      const expectedUrl = `${baseApiUrl}/Company/GTP/list?PageNumber=${mockFilter.pageNumber}&ColumnName=${mockFilter.ColumnName}&Asc=${mockFilter.asc}&InputSearch=${mockFilter.inputSearch}&BusinessHeading=${mockFilter.BusinessHeading}&Status=${mockFilter.status}&Solicitud=${mockFilter.statusSolicitud}&DateFrom=${expectedDateFrom}&DateTo=${expectedDateTo}`;

      service.getEmpresas(mockFilter).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(service.EnterprisesItems).toEqual(mockResponse);
        expect(service.pageMessage).toBe('Mostrando 1 - 50 de 55 elementos');
        expect((service as any).lastFilter).toEqual(mockFilter);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should use lastFilter if filter is null', (done) => {
      (service as any).lastFilter = mockFilter;
      const expectedDateFrom = encodeURI(
        moment(mockFilter.dateFrom).format('DD/MM/YYYY'),
      );
      const expectedDateTo = encodeURI(
        moment(mockFilter.dateTo).format('DD/MM/YYYY'),
      );
      const expectedUrl = `${baseApiUrl}/Company/GTP/list?PageNumber=${mockFilter.pageNumber}&ColumnName=${mockFilter.ColumnName}&Asc=${mockFilter.asc}&InputSearch=${mockFilter.inputSearch}&BusinessHeading=${mockFilter.BusinessHeading}&Status=${mockFilter.status}&Solicitud=${mockFilter.statusSolicitud}&DateFrom=${expectedDateFrom}&DateTo=${expectedDateTo}`;

      service.getEmpresas(null).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty/null filter properties correctly in URL', (done) => {
      const minimalFilter: GtpFilter = {
        pageNumber: 2,
        ColumnName: 'id',
        asc: false,
        inputSearch: '',
        BusinessHeading: null,
        status: [],
        statusSolicitud: undefined,
        dateFrom: null,
        dateTo: undefined,
      };
      const expectedUrl = `${baseApiUrl}/Company/GTP/list?PageNumber=2&ColumnName=id&Asc=false&InputSearch=&BusinessHeading=&Status=&Solicitud=${undefined}&DateFrom=&DateTo=`;
      service.getEmpresas(minimalFilter).subscribe(() => done());

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ totalCompanies: 0, listCompanyGTP: [] });
    });

    it('should calculate pageMessage correctly for totalCompanies = 0', (done) => {
      const zeroResponse: EnterprisesPagedList = {
        totalCompanies: 0,
        listCompanyGTP: [],
      };
      service.getEmpresas(mockFilter).subscribe((response) => {
        expect(response).toEqual(zeroResponse);
        expect(service.pageMessage).toBe('Mostrando 0 de 0 elementos');
        done();
      });

      const req = httpMock.expectOne((req) =>
        req.url.startsWith(`${baseApiUrl}/Company/GTP/list`),
      );
      req.flush(zeroResponse);
    });

    it('should calculate pageMessage correctly when end exceeds totalCompanies', (done) => {
      const smallResponse: EnterprisesPagedList = {
        totalCompanies: 35,
        listCompanyGTP: [
          /*...*/
        ],
      };
      const filterPage1: GtpFilter = { ...mockFilter, pageNumber: 1 };

      service.getEmpresas(filterPage1).subscribe((response) => {
        expect(response).toEqual(smallResponse);
        expect(service.pageMessage).toBe('Mostrando 1 - 35 de 35 elementos');
        done();
      });

      const req = httpMock.expectOne((req) =>
        req.url.startsWith(`${baseApiUrl}/Company/GTP/list`),
      );
      req.flush(smallResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });

      service.getEmpresas(mockFilter).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        },
      });

      const req = httpMock.expectOne((req) =>
        req.url.startsWith(`${baseApiUrl}/Company/GTP/list`),
      );
      req.flush('Error', mockError);
    });
  });

  it('GetEnterpriseGtp() should fetch enterprise data by ID', (done) => {
    const enterpriseId = 123;
    const mockCompanyData: ICompanyData = {
      id: enterpriseId,
      name: 'Test Enterprise',
    } as any;
    const expectedUrl = `${baseApiUrl}/company/GTP/client/${enterpriseId}`;

    service.GetEnterpriseGtp(enterpriseId).subscribe((data) => {
      expect(data).toEqual(mockCompanyData);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanyData);
  });

  it('GetEnterpriseGtp() should handle HTTP errors', (done) => {
    const enterpriseId = 456;
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/client/${enterpriseId}`;

    service.GetEnterpriseGtp(enterpriseId).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', mockError);
  });

  describe('GetServicesGtp', () => {
    const enterpriseId = 789;
    const expectedUrl = `${baseApiUrl}/company/GTP/services/${enterpriseId}/${false}`;
    const mockRawServiceData = [
      {
        id: 1,
        res: '12093',
        name: 'Service 1',
        newName: 'New Service 1',
        newNameCode: 'NSC1',
        debtorCode: 'DNI',
        dataType: 'C',
        paymentType: 'PayA',
        idAccount: '10',
        accountNumber: '111',
        currency: '001',
        useAppWeb: true,
        useAgent: false,
        useStore: true,
        partialPayment: 'N',
        chargeInterest: 'S',
        chargeType: 1,
        interestType: 'M',
        amount: 1,
        percentage: null,
        currencySymbol: 'S/',
        inReview: false,
        status: 'Active',
        newNameGTPStatus: 2,
        newNameCodeGTPStatus: 1,
        entry: '12',
      },
      {
        id: 2,
        res: '12091',
        name: 'Service 2',
        newName: 'Service 2',
        newNameCode: 'SC2',
        debtorCode: 'RUC',
        dataType: 'C',
        paymentType: 'M',
        idAccount: '20',
        accountNumber: '222',
        currency: '002',
        useAppWeb: false,
        useAgent: true,
        useStore: false,
        partialPayment: 'S',
        chargeInterest: 'N',
        chargeType: 1,
        interestType: 'M',
        amount: 2,
        percentage: 5,
        currencySymbol: '$',
        inReview: true,
        status: 'Inactive',
        newNameGTPStatus: 1,
        newNameCodeGTPStatus: 1,
        entry: '12',
      },
    ];

    const expectedTransformedServices: DataServiceGTP[] = [
      {
        id: 1,
        res: '12093',
        name: 'Service 1',
        newName: 'New Service 1',
        newNameCode: 'NSC1',
        debtorCode: 'DNI',
        dataType: 'C',
        paymentType: 'PayA',
        idAccount: '10',
        accountNumber: '111',
        currency: '001',
        useAppWeb: true,
        useAgent: false,
        useStore: true,
        partialPayment: 'N',
        chargeInterest: 'S',
        chargeType: '1',
        interestType: 'M',
        amount: 1,
        porcentage: null,
        currencySymbol: 'S/',
        inReview: false,
        status: 'Active',
        acceptednewNameCode: null,
        acceptednewName: null,
        nombreHabilitado: true,
        nombreCodHabilitado: true,
        newNameGTPStatus: 2,
        newNameCodeGTPStatus: 1,
        nombre: 'Service 1',
        rubro: '12',
        codDeudor: 'DNI',
        tipoDato: 'C',
        tipoPago: 'PayA',
        nroCuenta: '111',
        moneda: '001',
        simboloMoneda: 'S/',
        usaWebApp: true,
        usaAgente: false,
        usaTienda: true,
        cobraMora: 'S',
        periodoMora: '1',
        tipoMora: 'M',
        monto: 1,
        porcentaje: null,
        pagoPartes: 'N',
      },
      {
        id: 2,
        res: '12091',
        name: 'Service 2',
        newName: 'Service 2',
        newNameCode: 'SC2',
        debtorCode: 'RUC',
        dataType: 'C',
        paymentType: 'M',
        idAccount: '20',
        accountNumber: '222',
        currency: '002',
        useAppWeb: false,
        useAgent: true,
        useStore: false,
        partialPayment: 'S',
        chargeInterest: 'N',
        chargeType: '1',
        interestType: 'M',
        amount: 2,
        porcentage: 5,
        currencySymbol: '$',
        inReview: true,
        status: 'Inactive',
        acceptednewNameCode: null,
        acceptednewName: null,
        nombreHabilitado: false,
        nombreCodHabilitado: true,
        newNameGTPStatus: 1,
        newNameCodeGTPStatus: 1,
        nombre: 'Service 2',
        rubro: '12',
        codDeudor: 'RUC',
        tipoDato: 'C',
        tipoPago: 'M',
        nroCuenta: '222',
        moneda: '002',
        simboloMoneda: '$',
        usaWebApp: false,
        usaAgente: true,
        usaTienda: false,
        cobraMora: 'N',
        periodoMora: '1',
        tipoMora: 'M',
        monto: 2,
        porcentaje: 5,
        pagoPartes: 'S',
      },
    ];

    it('should fetch and transform services, updating the public services property', fakeAsync(() => {
      expect(service.services).toEqual([]);
      service.GetServicesGtp(enterpriseId);
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');

      req.flush(mockRawServiceData);

      tick();

      expect(service.services.length).toBe(2);
      expect(service.services).toEqual(expectedTransformedServices);

      expect(service.services[0].chargeType).toBe('1');
      expect(service.services[1].chargeType).toBe('1');
      expect(service.services[0].nombreHabilitado).toBe(true);
      expect(service.services[1].nombreHabilitado).toBe(false);
      expect(service.services[0].idAccount).toBe('10');
      expect(service.services[1].idAccount).toBe('20');
    }));

    it('should clear existing services before fetching new ones', () => {
      service.services = [{ id: 99 } as any];
      expect(service.services.length).toBe(1);

      service.GetServicesGtp(enterpriseId);

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockRawServiceData);

      expect(service.services).toEqual(expectedTransformedServices);
    });

    it('should leave services empty if HTTP call fails (due to internal subscribe)', () => {
      service.services = [];
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });

      service.GetServicesGtp(enterpriseId);

      const req = httpMock.expectOne(expectedUrl);
      req.flush('Error', mockError);

      expect(service.services).toEqual([]);
    });
  });

  it('AprobarEmpresaServ() should POST approval data', (done) => {
    const approvalData = { companyId: 1, serviceId: 5, approved: true };
    const mockResponse = { success: true, message: 'Approved' };
    const expectedUrl = `${baseApiUrl}/company/gtp/approve`;

    service.AprobarEmpresaServ(approvalData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(approvalData);
    req.flush(mockResponse);
  });

  it('AprobarEmpresaServ() should handle HTTP errors', (done) => {
    const approvalData = { companyId: 1, serviceId: 5, approved: true };
    const mockError = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
    });
    const expectedUrl = `${baseApiUrl}/company/gtp/approve`;

    service.AprobarEmpresaServ(approvalData).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Error', mockError);
  });

  describe('Descartar', () => {
    beforeEach(() => {
      service.services = [];
    });

    it('should remove the last item if it is new (id=null) and index matches', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: null } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(1, true);
      expect(service.services.length).toBe(1);
      expect(service.services[0].id).toBe(1);
    });

    it('should remove the last item if it is new (id=undefined) and index matches', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: undefined } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(1, true);
      expect(service.services.length).toBe(1);
    });

    it('should remove the last item if it is new (id < 0) and index matches', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: -1 } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(1, true);
      expect(service.services.length).toBe(1);
    });

    it('should NOT remove if isNew is false', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: null } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(1, false);
      expect(service.services.length).toBe(2);
    });

    it('should NOT remove if index is not the last item', () => {
      service.services = [
        { id: null } as DataServiceGTP,
        { id: 1 } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(0, true);
      expect(service.services.length).toBe(2);
    });

    it('should NOT remove if the last item has a valid ID (>= 0)', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: 2 } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(1, true);
      expect(service.services.length).toBe(2);
    });

    it('should NOT remove if services length is 1 or less', () => {
      service.services = [{ id: null } as DataServiceGTP];
      expect(service.services.length).toBe(1);
      service.Descartar(0, true);
      expect(service.services.length).toBe(1);
    });

    it('should NOT remove if index is out of bounds', () => {
      service.services = [
        { id: 1 } as DataServiceGTP,
        { id: null } as DataServiceGTP,
      ];
      expect(service.services.length).toBe(2);
      service.Descartar(5, true);
      expect(service.services.length).toBe(2);
      service.Descartar(-1, true);
      expect(service.services.length).toBe(2);
    });
  });

  it('ReenviarPAG() should POST to resend PAG for a client', (done) => {
    const clientId = 999;
    const mockResponse = { status: 'resent' };
    const expectedUrl = `${baseApiUrl}/company/GTP/client/${clientId}/pag`;

    service.ReenviarPAG(clientId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('ReenviarPAG() should handle HTTP errors', (done) => {
    const clientId = 999;
    const mockError = new HttpErrorResponse({
      status: 404,
      statusText: 'Client Not Found',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/client/${clientId}/pag`;

    service.ReenviarPAG(clientId).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Error', mockError);
  });

  it('clientsUnregistered() should POST date range and expect a blob response', (done) => {
    const filter: GtpFilter = {
      dateFrom: new Date('2023-02-01T00:00:00'),
      dateTo: new Date('2023-02-28T23:59:59'),
    } as GtpFilter;
    const expectedPayload = {
      inicio: '2023/02/01',
      final: '2023/02/28',
    };
    const mockBlob = new Blob(['report data'], {
      type: 'application/octet-stream',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/client/unregistered`;

    service.clientsUnregistered(filter).subscribe((response: Blob) => {
      expect(response).toBeInstanceOf(Blob);
      expect(response.type).toBe('application/octet-stream');

      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedPayload);
    req.flush(mockBlob);
  });

  it('clientsUnregistered() should handle null dates in filter', (done) => {
    const filter: GtpFilter = { dateFrom: null, dateTo: null } as GtpFilter;
    const expectedPayload = { inicio: '', final: '' };
    const mockBlob = new Blob(['report data']);
    const expectedUrl = `${baseApiUrl}/company/GTP/client/unregistered`;

    service.clientsUnregistered(filter).subscribe(() => done());

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedPayload);
    req.flush(mockBlob);
  });

  it('clientsUnregistered() should handle HTTP errors', (done) => {
    const filter: GtpFilter = {
      dateFrom: new Date(),
      dateTo: new Date(),
    } as GtpFilter;
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Report Error',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/client/unregistered`;

    service.clientsUnregistered(filter).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    const errorBlob = new Blob(['Error details from server or empty']);
    req.flush(errorBlob, { status: 500, statusText: 'Report Error' });
  });

  it('GetCorreoGtp() should fetch emails and extract the emails array', (done) => {
    const mockEmails: CorreoGtpModel[] = [{ correo: 'test@example.com' }];
    const mockResponse = { emails: mockEmails };
    const expectedUrl = `${baseApiUrl}/company/GTP/emailgtp`;

    service.GetCorreoGtp().subscribe((emails) => {
      expect(emails).toEqual(mockEmails);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('GetCorreoGtp() should handle HTTP errors', (done) => {
    const mockError = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/emailgtp`;

    service.GetCorreoGtp().subscribe({
      next: () => fail('should have failed with 403 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(403);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Error', mockError);
  });

  it('PostConfigurarCorreoGtp() should POST the emails configuration', (done) => {
    const emailsToPost: CorreoGtpModel[] = [{ correo: 'new@example.com' }];
    const expectedPayload = { emails: emailsToPost };
    const mockResponse = { success: true };
    const expectedUrl = `${baseApiUrl}/company/GTP/emailgtp`;

    service.PostConfigurarCorreoGtp(emailsToPost).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedPayload);
    req.flush(mockResponse);
  });

  it('PostConfigurarCorreoGtp() should handle HTTP errors', (done) => {
    const emailsToPost: CorreoGtpModel[] = [{ correo: 'update@example.com' }];
    const mockError = new HttpErrorResponse({
      status: 400,
      statusText: 'Invalid Data',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/emailgtp`;

    service.PostConfigurarCorreoGtp(emailsToPost).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Error', mockError);
  });

  it('saveDatosEmpresa() should POST company data', (done) => {
    const companyData = { name: 'Updated Company Name', ruc: '12345678901' };
    const mockResponse = { id: 10, message: 'Saved' };
    const expectedUrl = `${baseApiUrl}/company/GTP/company/data`;

    service.saveDatosEmpresa(companyData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(companyData);
    req.flush(mockResponse);
  });

  it('saveDatosEmpresa() should handle HTTP errors', (done) => {
    const companyData = { name: 'Bad Data' };
    const mockError = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
    });
    const expectedUrl = `${baseApiUrl}/company/GTP/company/data`;

    service.saveDatosEmpresa(companyData).subscribe({
      next: () => fail('should have failed with 422 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(422);
        done();
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Error', mockError);
  });
});
