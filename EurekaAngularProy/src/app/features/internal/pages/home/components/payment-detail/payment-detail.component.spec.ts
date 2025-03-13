import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import {
  AdobeEvent,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { TransactionService } from '../../../../../../shared/services/transaction.service';
import { PaymentDetailComponent } from './payment-detail.component';

describe('PaymentDetailComponent', () => {
  let component: PaymentDetailComponent;
  let fixture: ComponentFixture<PaymentDetailComponent>;
  let transactionServiceMock: jest.Mocked<TransactionService>;
  let trackingServiceMock: jest.Mocked<TrackingService>;
  let storeMock: jest.Mocked<Store>;
  let dialogRef;

  beforeEach(async () => {
    transactionServiceMock = {
      getPayments: jest.fn().mockReturnValue(of([])),
      editPayment: jest
        .fn()
        .mockReturnValue(of({ success: true, status: 'updated' })),
      addPayment: jest
        .fn()
        .mockReturnValue(of({ success: true, status: 'added' })),
      deletePayment: jest
        .fn()
        .mockReturnValue(of({ success: true, status: 'deleted' })),
    } as unknown as jest.Mocked<TransactionService>;

    trackingServiceMock = {
      trackEvent: jest.fn(),
    } as unknown as jest.Mocked<TrackingService>;

    storeMock = {
      select: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<Store>;

    jest.spyOn(Swal, 'fire').mockResolvedValue({
      value: true,
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    });

    await TestBed.configureTestingModule({
      providers: [
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: TrackingService, useValue: trackingServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDetailComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load payments on init', () => {
    expect(transactionServiceMock.getPayments).toHaveBeenCalled();
  });

  it('should add a new payment item', () => {
    component.addItem();
    expect(component.items.length).toBe(1);
    expect(component.isEditingRow).toBeTruthy();
  });

  it('should edit an existing payment item', () => {
    const item = { id: 1, amount: 100, date: '2024-01-01', channel: 'POS' };
    component.items = [item];
    component.editItm(item);
    expect((item as any).editing).toBeTruthy();
  });

  it('should validate and save payment item', async () => {
    const item = {
      id: 1,
      newAmount: '100.50',
      newDate: new Date('2025-03-20'),
      newChannel: 'POS',
      errores: {},
    };

    await component.saveItm(item);

    expect(transactionServiceMock.editPayment).toHaveBeenCalledWith(
      component.debtId,
      item.id,
      expect.objectContaining({
        amount: 100.5,
        date: item.newDate,
        channel: item.newChannel,
      }),
    );
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        category: 'Editado',
      }),
    );
  });

  it('should delete a payment item', async () => {
    const item = { id: 1 };
    component.items = [item];
    await component.delItm(item);
    expect(transactionServiceMock.deletePayment).toHaveBeenCalledWith(
      component.debtId,
      item.id,
    );
  });

  it('should format valid numeric input to 2 decimal places', () => {
    const itm = { newAmount: '12.345' };
    component.amountBlur(itm);
    expect(itm.newAmount).toBe('12.35');
  });

  it('should not modify invalid numeric input (NaN)', () => {
    const itm = { newAmount: 'abc' };
    component.amountBlur(itm);
    expect(itm.newAmount).toBe('abc');
  });

  it('should not modify null or undefined input', () => {
    const itm = { newAmount: null };
    component.amountBlur(itm);
    expect(itm.newAmount).toBeNull();
  });

  it('should not modify empty string input', () => {
    const itm = { newAmount: '' };
    component.amountBlur(itm);
    expect(itm.newAmount).toBe('');
  });

  it('should call trackEvent with correct event properties', () => {
    component.close();
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackAction,
      {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Cerrar agregar un pago',
        label: 'Cerrar',
        typeElement: 'Botón',
        location: 'Movimientos - Detalle de pago',
      },
    );
  });

  it('should call dialogRef.close with correct status', () => {
    component.status = 'test-status';
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith({ status: 'test-status' });
  });
});
