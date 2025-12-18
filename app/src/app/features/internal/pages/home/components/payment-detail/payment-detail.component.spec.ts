import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
      imports: [PaymentDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: TrackingService, useValue: trackingServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
    })
      .overrideComponent(PaymentDetailComponent, {
        set: {
          providers: [
            { provide: TransactionService, useValue: transactionServiceMock },
            DatePipe,
          ],
        },
      })
      .compileComponents();

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

  it('should set isEditingRow and currentEditingItem on addItem', () => {
    component.addItem();
    expect(component.isEditingRow).toBe(true);
    expect(component.currentEditingItem).not.toBeNull();
    expect(component.currentEditingItem.newAmount).toBeNull();
  });

  it('should set isEditingRow and currentEditingItem on editItm', () => {
    const item = { id: 1, amount: 100, date: '2024-01-01', channel: 'POS' };
    component.editItm(item);
    expect(component.isEditingRow).toBe(true);
    expect(component.currentEditingItem).toEqual(
      expect.objectContaining({
        id: 1,
        newAmount: 100,
      }),
    );
  });

  it('should reset isEditingRow and currentEditingItem on cancelItem', () => {
    component.isEditingRow = true;
    component.currentEditingItem = {};
    component.cancelItem();
    expect(component.isEditingRow).toBe(false);
    expect(component.currentEditingItem).toBeNull();
  });

  it('should validate and save payment item', async () => {
    const item = {
      id: 1,
      newAmount: '100.50',
      newDate: new Date('2025-03-20'),
      newChannel: 'POS',
      errores: {},
    };
    component.currentEditingItem = item;
    await component.saveItm(item);

    expect(transactionServiceMock.editPayment).toHaveBeenCalledWith(
      component.debtId,
      item.id,
      expect.objectContaining({
        amount: 100.5,
        channel: 'POS',
      }),
    );
  });

  it('should delete a payment item', async () => {
    const item = { id: 1 };
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

  it('should call trackEvent with correct event properties on close', () => {
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

  it('should call dialogRef.close with correct status on close', () => {
    component.status = 'test-status';
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith({ status: 'test-status' });
  });
});
