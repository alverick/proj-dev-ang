import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { clone } from 'ramda';

import { environment } from '../../../environments/environment';
import { type Debts, type DebtsPagedList } from '../models/debts';
import { type DebtEdit } from '../models/debts-edit.model';
import { type DebstFilter } from '../models/debts-filter.model';
import { TransactionService } from './transaction.service';

const createMockDebt = (
  id: number,
  status: string,
  hasIBKPayments: boolean,
  selected = false,
  dueDate: Date | string | null = new Date(),
  emissionDate: Date | string = new Date(),
  amount = 100,
): Debts => {
  const processDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const processedDueDate = dueDate === null ? null : processDate;
  return {
    id,
    status,
    hasIBKPayments,
    selected,
    emissionDate:
      typeof emissionDate === 'string' ? new Date(emissionDate) : emissionDate,
    dueDate: processedDueDate,
    amount,
    service: 'S' + id,
    currency: 'PEN',
    editInput: false,
    editButton: false,
    newStatus: '1',
    errores: {},
    code: '2222',
    firstName: 'nombre',
    lastName: 'apellido',
    concept: 'concepto',
    payDate: undefined,
    channel: '',
    editPending: false,
  };
};

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.END_POINT;
  let pipe: DatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService,DatePipe],
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
    (service as any).URI_API = apiUrl;

    service.debtItems = { count: 0, countNoIbkPayments: 0, data: [] };
    service.debtItemsOriginal = { count: 0, countNoIbkPayments: 0, data: [] };
    service.itemsForDelete = [];
    service.pageMessage = 'Mostrando 0 de 0 elementos';
    (service as any).lastFilter = null;
    pipe = new DatePipe('en-US');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDeuda', () => {
    const mockFilter: DebstFilter = {
      pageNumber: 1,
      columnName: 'emissionDate',
      inputSearch: 'test',
      asc: true,
      service: 'ServiceA',
      status: 'PENDIENTE',
      dateForFilter: 'emissionDate',
      dateFrom: new Date('2023-01-01T00:00:00Z'),
      dateTo: new Date('2023-01-31T23:59:59Z'),
    };

    const mockApiResponse: DebtsPagedList = {
      count: 1,
      countNoIbkPayments: 1,
      data: [
        {
          ...createMockDebt(1, 'PENDIENTE', false),
          emissionDate: '2023-01-10T00:00:00Z',
          dueDate: '2023-02-10T00:00:00Z',
        },
      ],
    };
    const mockApiResponseParsed: DebtsPagedList = {
      count: 1,
      countNoIbkPayments: 1,
      data: [
        {
          ...createMockDebt(1, 'PENDIENTE', false),
          emissionDate: new Date('2023-01-10T00:00:00Z'),
          dueDate: new Date('2023-02-10T00:00:00Z'),
        },
      ],
    };

    it('should fetch debts, process dates, add properties, and update state', (done) => {
      service.getDeuda(mockFilter).subscribe((response) => {
        expect(response).toEqual(mockApiResponseParsed);

        expect(service.debtItems.count).toBe(1);
        expect(service.debtItems.data.length).toBe(1);
        const processedItem = service.debtItems.data[0];
        expect(processedItem.id).toBe(1);
        expect(processedItem.emissionDate).toEqual(
          new Date('2023-01-10T00:00:00Z'),
        );
        expect(processedItem.dueDate).toEqual(new Date('2023-02-10T00:00:00Z'));
        expect(processedItem.editInput).toBe(false);
        expect(processedItem.editButton).toBe(false);
        expect(processedItem.newStatus).toBe('1');
        expect(processedItem.errores).toEqual({});
        expect(processedItem.selected).toBe(false);
        expect(service.debtItemsOriginal).toEqual(service.debtItems);
        expect(service.pageMessage).toBe('Mostrando 1 - 1 de 1 elementos');
        expect((service as any).lastFilter).toEqual(mockFilter);
        expect(service.itemsForDelete).toEqual([]);
        done();
      });

      const expectedUrl = `${apiUrl}/debt`;
      const req = httpMock.expectOne(
        (request) => request.url === expectedUrl && request.method === 'GET',
      );

      expect(req.request.params.get('PageNumber')).toBe('1');
      expect(req.request.params.get('ColumnName')).toBe('emissionDate');
      expect(req.request.params.get('InputSearch')).toBe('test');
      expect(req.request.params.get('Asc')).toBe('true');
      expect(req.request.params.get('Service')).toBe('ServiceA');
      expect(req.request.params.get('Status')).toBe('PENDIENTE');
      expect(req.request.params.get('DateForFilter')).toBe('emissionDate');
      expect(req.request.params.get('DateFrom')).toBe(
        encodeURI(pipe.transform(mockFilter.dateFrom, 'dd/MM/yyyy')),
      );
      expect(req.request.params.get('DateTo')).toBe(
        encodeURI(pipe.transform(mockFilter.dateTo, 'dd/MM/yyyy')),
      );

      req.flush(clone(mockApiResponse));
    });

    it('should use lastFilter if filter is null', (done) => {
      service.getDeuda(mockFilter).subscribe(() => {
        service.getDeuda(null).subscribe(() => {
          expect((service as any).lastFilter).toEqual(mockFilter);
          done();
        });

        const req2 = httpMock.expectOne(
          (request) =>
            request.url === `${apiUrl}/debt` && request.method === 'GET',
        );
        expect(req2.request.params.get('PageNumber')).toBe('1');
        expect(req2.request.params.get('InputSearch')).toBe('test');
        req2.flush(clone(mockApiResponse));
      });

      const req1 = httpMock.expectOne(
        (request) =>
          request.url === `${apiUrl}/debt` && request.method === 'GET',
      );
      req1.flush(clone(mockApiResponse));
    });

    it('should handle empty/null filter properties correctly', (done) => {
      const emptyFilter: DebstFilter = {
        pageNumber: 1,
        columnName: '',
        inputSearch: '',
        asc: false,
        service: null,
        status: undefined,
        dateForFilter: '',
        dateFrom: null,
        dateTo: '',
      };
      service.getDeuda(emptyFilter).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      expect(req.request.params.get('Service')).toBe('');
      expect(req.request.params.get('Status')).toBe('');
      expect(req.request.params.get('DateForFilter')).toBe('');
      expect(req.request.params.get('DateFrom')).toBe('');
      expect(req.request.params.get('DateTo')).toBe('');
      req.flush({ count: 0, countNoIbkPayments: 0, data: [] });
    });

    it('should update pageMessage for empty results', (done) => {
      const emptyResponse: DebtsPagedList = {
        count: 0,
        countNoIbkPayments: 0,
        data: [],
      };
      service.getDeuda(mockFilter).subscribe(() => {
        expect(service.pageMessage).toBe('Mostrando 0 de 0 elementos');
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush(emptyResponse);
    });

    it('should update pageMessage correctly for partial last page', (done) => {
      const partialResponse: DebtsPagedList = {
        count: 53,
        countNoIbkPayments: 53,
        data: [
          /* 3 items */
        ],
      };
      const filterPage2: DebstFilter = { ...mockFilter, pageNumber: 2 };

      service.getDeuda(filterPage2).subscribe(() => {
        expect(service.pageMessage).toBe('Mostrando 51 - 53 de 53 elementos');
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      expect(req.request.params.get('PageNumber')).toBe('2');
      req.flush(partialResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        error: 'test error',
        status: 500,
        statusText: 'Server Error',
      });

      service.getDeuda(mockFilter).subscribe({
        next: () => done.fail('should have failed with an error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe('test error');
          done();
        },
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush('test error', { status: 500, statusText: 'Server Error' });
    });

    it('should select items and populate itemsForDelete when selectedUniverse is true', (done) => {
      const mockItemEligible = createMockDebt(1, 'PENDIENTE', false);
      const mockItemNotEligibleStatus = createMockDebt(2, 'PAGADO', false);
      const mockItemNotEligibleIBK = createMockDebt(3, 'PENDIENTE', true);

      const responseWithMixedItems: DebtsPagedList = {
        count: 3,
        countNoIbkPayments: 2,
        data: [
          {
            ...(mockItemEligible as any),
            emissionDate: '2023-01-10Z',
            dueDate: '2023-02-10Z',
          },
          {
            ...(mockItemNotEligibleStatus as any),
            emissionDate: '2023-01-11Z',
            dueDate: null,
          },
          {
            ...(mockItemNotEligibleIBK as any),
            emissionDate: '2023-01-12Z',
            dueDate: '2023-02-12Z',
          },
        ],
      };

      service.getDeuda(mockFilter, true).subscribe(() => {
        expect(service.debtItems.data[0].selected).toBe(true);
        expect(service.debtItems.data[1].selected).toBe(false);
        expect(service.debtItems.data[2].selected).toBe(false);
        expect(service.itemsForDelete).toEqual([1]);
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush(clone(responseWithMixedItems));
    });

    it('should clear itemsForDelete when selectedUniverse is true before processing', (done) => {
      service.itemsForDelete = [99];
      service.getDeuda(mockFilter, true).subscribe(() => {
        expect(service.itemsForDelete).toEqual([1]);
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush(clone(mockApiResponse));
    });

    it('should NOT clear itemsForDelete when selectedUniverse is false', (done) => {
      service.itemsForDelete = [99];
      service.getDeuda(mockFilter, false).subscribe(() => {
        expect(service.itemsForDelete).toEqual([99]);
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush(clone(mockApiResponse));
    });

    it('should correctly determine selected status based on itemsForDelete when selectedUniverse is false', (done) => {
      service.itemsForDelete = [1];
      const responseWithEligible: DebtsPagedList = {
        count: 1,
        countNoIbkPayments: 1,
        data: [
          {
            ...(createMockDebt(1, 'PENDIENTE', false) as any),
            emissionDate: '2023-01-10Z',
            dueDate: '2023-02-10Z',
          },
        ],
      };

      service.getDeuda(mockFilter, false).subscribe(() => {
        expect(service.debtItems.data[0].selected).toBe(true);
        done();
      });

      const req = httpMock.expectOne(
        (request) => request.url === `${apiUrl}/debt`,
      );
      req.flush(clone(responseWithEligible));
    });
  });

  describe('editDeuda', () => {
    const debtId = 123;
    const mockDebtEdit: DebtEdit = {
      emissionDate: '2023-03-15',
      dueDate: '2023-04-15',
      concept: 'Concepto',
    };
    const mockSuccessResponse = { success: true };

    it('should send a POST request to edit the debt', (done) => {
      service.editDeuda(debtId, mockDebtEdit).subscribe((response) => {
        expect(response).toEqual(mockSuccessResponse);
        done();
      });

      const expectedUrl = `${apiUrl}/debt/put/${debtId}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockDebtEdit);
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      service.editDeuda(debtId, mockDebtEdit).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/debt/put/${debtId}`);
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('report', () => {
    const mockFilter: DebstFilter = {
      pageNumber: 1,
      columnName: 'service',
      inputSearch: 'report search',
      asc: false,
      service: 'ServiceB',
      status: 'PAGADO',
      dateForFilter: 'dueDate',
      dateFrom: new Date('2023-02-01T00:00:00Z'),
      dateTo: new Date('2023-02-28T23:59:59Z'),
    };
    const mockBlob = new Blob(['report data']);

    it('should send a POST request to generate a report with formatted dates', (done) => {
      service.report(mockFilter).subscribe((response) => {
        expect(response).toBeInstanceOf(Blob);
        expect(response).toEqual(mockBlob);
        done();
      });

      const expectedUrl = `${apiUrl}/debt/report`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.responseType).toBe('blob');

      const expectedBody: DebstFilter = {
        ...mockFilter,
        dateFrom: pipe.transform(mockFilter.dateFrom, 'dd/MM/yyyy'),
        dateTo: pipe.transform(mockFilter.dateTo, 'dd/MM/yyyy'),
      };
      expect(req.request.body).toEqual(expectedBody);

      req.flush(mockBlob);
    });

    it('should handle null/empty dates in report filter', (done) => {
      const filterWithEmptyDates: DebstFilter = {
        ...mockFilter,
        dateFrom: null,
        dateTo: '',
      };
      service.report(filterWithEmptyDates).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/debt/report`);
      expect(req.request.body.dateFrom).toBe('');
      expect(req.request.body.dateTo).toBe('');
      req.flush(mockBlob);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 503,
        statusText: 'Service Unavailable',
      });

      service.report(mockFilter).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(503);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/debt/report`);
      const errorBlob = new Blob(['Detailed error message or just empty']);
      req.flush(errorBlob, { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('updateDeuda', () => {
    const debtId = 456;
    const mockSuccessResponse = { message: 'Updated' };

    it('should send a POST request to update debt payment status (paid=true)', (done) => {
      service.updateDeuda(debtId, true).subscribe((response) => {
        expect(response).toEqual(mockSuccessResponse);
        done();
      });

      const expectedUrl = `${apiUrl}/debt/pay`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ idDebt: debtId, Payed: true });
      req.flush(mockSuccessResponse);
    });

    it('should send a POST request to update debt payment status (paid=false)', (done) => {
      service.updateDeuda(debtId, false).subscribe((response) => {
        expect(response).toEqual(mockSuccessResponse);
        done();
      });

      const expectedUrl = `${apiUrl}/debt/pay`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ idDebt: debtId, Payed: false });
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });

      service.updateDeuda(debtId, true).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/debt/pay`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPayments', () => {
    const debtId = 789;
    const mockPaymentsResponse = [
      { id: 1, amount: 50, paymentDate: '2023-01-15' },
      { id: 2, amount: 50, paymentDate: '2023-02-15' },
    ];

    it('should send a POST request to get payments and add editing properties', (done) => {
      service.getPayments(debtId).subscribe((payments) => {
        expect(payments.length).toBe(2);
        expect(payments[0]).toEqual(
          expect.objectContaining({ id: 1, editing: false, errores: {} }),
        );
        expect(payments[1]).toEqual(
          expect.objectContaining({ id: 2, editing: false, errores: {} }),
        );
        done();
      });

      const expectedUrl = `${apiUrl}/payment/ofDebt/${debtId}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockPaymentsResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.getPayments(debtId).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/payment/ofDebt/${debtId}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addPayment', () => {
    const debtId = 101;
    const mockPayment = {
      amount: 75,
      paymentDate: '2023-03-20',
      description: 'New payment',
    };
    const mockSuccessResponse = { id: 3, ...mockPayment, debtId: debtId };

    it('should send a POST request to add a payment', (done) => {
      service.addPayment(debtId, mockPayment).subscribe((response) => {
        expect(response).toEqual(mockSuccessResponse);
        done();
      });

      const expectedUrl = `${apiUrl}/payment`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...mockPayment, debtId: debtId });
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      service.addPayment(debtId, mockPayment).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/payment`);
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('editPayment', () => {
    const debtId = 102;
    const paymentId = 5;
    const mockPaymentUpdate = { amount: 80, description: 'Updated payment' };
    const mockSuccessResponse = { success: true };

    it('should send a POST request to edit a payment', (done) => {
      service
        .editPayment(debtId, paymentId, mockPaymentUpdate)
        .subscribe((response) => {
          expect(response).toEqual(mockSuccessResponse);
          done();
        });

      const expectedUrl = `${apiUrl}/payment/${paymentId}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');

      expect(req.request.body).toEqual({
        ...mockPaymentUpdate,
        debtId: debtId,
      });
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });

      service.editPayment(debtId, paymentId, mockPaymentUpdate).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/payment/${paymentId}`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePayment', () => {
    const debtId = 103;
    const paymentId = 6;
    const mockSuccessResponse = { success: true };

    it('should send a POST request to delete a payment', (done) => {
      service.deletePayment(debtId, paymentId).subscribe((response) => {
        expect(response).toEqual(mockSuccessResponse);
        done();
      });

      const expectedUrl = `${apiUrl}/payment/${paymentId}/ofDebt/${debtId}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
      });

      service.deletePayment(debtId, paymentId).subscribe({
        next: () => done.fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${apiUrl}/payment/${paymentId}/ofDebt/${debtId}`,
      );
      req.flush('Error', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('clearMarksForDeletes', () => {
    it('should clear the itemsForDelete array', () => {
      service.itemsForDelete = [1, 2, 3];
      expect(service.itemsForDelete.length).toBe(3);
      service.clearMarksForDeletes();
      expect(service.itemsForDelete.length).toBe(0);
      expect(service.itemsForDelete).toEqual([]);
    });
  });

  describe('isMarkedAll', () => {
    it('should return false if no eligible items exist (selectedUniverse=false)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PAGADO', false),
        createMockDebt(2, 'PENDIENTE', true),
      ];
      service.itemsForDelete = [];
      expect(service.isMarkedAll(false)).toBe(false);
    });

    it('should return false if no eligible items exist (selectedUniverse=true)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PAGADO', false, false),
        createMockDebt(2, 'PENDIENTE', true, false),
      ];
      expect(service.isMarkedAll(true)).toBe(false);
    });

    it('should return true if all eligible items are marked (selectedUniverse=false)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PENDIENTE', false),
        createMockDebt(2, 'PAGADO', false),
        createMockDebt(3, 'ACTIVO', false),
        createMockDebt(4, 'PENDIENTE', true),
      ];
      service.itemsForDelete = [1, 3];
      expect(service.isMarkedAll(false)).toBe(true);
    });

    it('should return false if some eligible items are not marked (selectedUniverse=false)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PENDIENTE', false),
        createMockDebt(2, 'PAGADO', false),
        createMockDebt(3, 'ACTIVO', false),
      ];
      service.itemsForDelete = [1];
      expect(service.isMarkedAll(false)).toBe(false);
    });

    it('should return true if all eligible items are selected (selectedUniverse=true)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PENDIENTE', false, true),
        createMockDebt(2, 'PAGADO', false, false),
        createMockDebt(3, 'ACTIVO', false, true),
        createMockDebt(4, 'PENDIENTE', true, false),
      ];
      expect(service.isMarkedAll(true)).toBe(true);
    });

    it('should return false if some eligible items are not selected (selectedUniverse=true)', () => {
      service.debtItems.data = [
        createMockDebt(1, 'PENDIENTE', false, true),
        createMockDebt(2, 'PAGADO', false, false),
        createMockDebt(3, 'ACTIVO', false, false),
      ];
      expect(service.isMarkedAll(true)).toBe(false);
    });
  });

  describe('resetDebts', () => {
    it('should reset debtItems to the state of debtItemsOriginal', () => {
      const originalState: DebtsPagedList = {
        count: 2,
        countNoIbkPayments: 2,
        data: [
          createMockDebt(10, 'PENDIENTE', false),
          createMockDebt(11, 'ACTIVO', false),
        ],
      };
      const modifiedState: DebtsPagedList = {
        count: 1,
        countNoIbkPayments: 1,
        data: [createMockDebt(10, 'PENDIENTE', false)],
      };

      service.debtItemsOriginal = clone(originalState);
      service.debtItems = clone(modifiedState);

      expect(service.debtItems).toEqual(modifiedState);
      expect(service.debtItems).not.toEqual(originalState);

      service.resetDebts();

      expect(service.debtItems).toEqual(originalState);
      expect(service.debtItems).not.toBe(service.debtItemsOriginal);
    });
  });
});
