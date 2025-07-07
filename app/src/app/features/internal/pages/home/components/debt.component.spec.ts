import { CurrencyPipe } from '@angular/common';
import {
  type ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { ServiceTypes } from '../../../../../shared/constants/services';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { HomeService } from '../../../../../shared/services/home.service';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../../shared/utils/helpers/popups';
import { DebtComponent } from './debt.component';

const swalAlertMock = {
  value: true,
  isConfirmed: true,
  isDenied: false,
  isDismissed: false,
};
describe('DebtComponent', () => {
  let component: DebtComponent;
  let fixture: ComponentFixture<DebtComponent>;
  let homeServiceMock: jest.Mocked<HomeService>;
  let excelServiceMock: jest.Mocked<ExcelService>;
  let trackingServiceMock: jest.Mocked<TrackingService>;
  let dialogRefMock: jest.Mocked<DynamicDialogRef<DebtComponent>>;

  beforeEach(async () => {
    homeServiceMock = {
      getDebtorCode: jest.fn(),
      postNewDebt: jest.fn(),
    } as unknown as jest.Mocked<HomeService>;

    excelServiceMock = {
      service: {},
    } as unknown as jest.Mocked<ExcelService>;

    trackingServiceMock = {
      trackEvent: jest.fn(),
    } as unknown as jest.Mocked<TrackingService>;

    dialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<DynamicDialogRef<DebtComponent>>;

    jest.spyOn(swalAlert, 'fire').mockResolvedValue(swalAlertMock);

    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        CurrencyPipe,
        { provide: HomeService, useValue: homeServiceMock },
        { provide: ExcelService, useValue: excelServiceMock },
        { provide: TrackingService, useValue: trackingServiceMock },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.debtForm).toBeDefined();
    expect(component.debtForm.controls.code).toBeDefined();
  });

  it('should call buscarNewCode when code value changes', fakeAsync(() => {
    jest.spyOn(component, 'buscarNewCode');
    component.debtForm.controls.code.setValue('12345');
    fixture.detectChanges();
    tick(600);
    expect(component.buscarNewCode).toHaveBeenCalled();
  }));

  it('should disable fields when setPartialMode is called with partial data', () => {
    excelServiceMock.service = { dataType: ServiceTypes.partial };
    component.setPartialMode();
    expect(component.debtForm.controls.dueDate.disabled).toBeTruthy();
  });

  it('should return if form is invalid', () => {
    component.grabarNuevo();
    expect(homeServiceMock.postNewDebt).not.toHaveBeenCalled();
  });

  it('should handle error response from postNewDebt', fakeAsync(() => {
    const debt = {
      amount: 120,
      concept: 'Test',
      dueDate: new Date('2025-02-02'),
      emissionDate: new Date('2025-02-01'),
      code: '123',
      firstName: 'John',
    };
    component.debtForm.patchValue(debt);
    const errorResponse = { success: false, message: 'Error message' };
    jest
      .spyOn(homeServiceMock, 'postNewDebt')
      .mockReturnValue(of(errorResponse));
    component.grabarNuevo();
    fixture.detectChanges();
    tick(600);
    expect(swalAlert.fire).toHaveBeenCalledWith({
      title: 'Ha ocurrido un error',
      html: errorResponse.message,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
    });
  }));

  it('should handle success response from postNewDebt and user clicks "Agrega otro"', fakeAsync(() => {
    const debt = {
      amount: 120,
      concept: 'Test',
      dueDate: new Date('2025-02-02'),
      emissionDate: new Date('2025-02-01'),
      code: '123',
      firstName: 'John',
    };
    component.debtForm.patchValue(debt);
    const successResponse = { success: true };
    jest
      .spyOn(homeServiceMock, 'postNewDebt')
      .mockReturnValue(of(successResponse));
    jest.spyOn(component.formDirective(), 'resetForm').mockReturnValue();
    jest.spyOn(component.debtForm, 'reset').mockReturnValue();
    component.grabarNuevo();
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      expect.any(Object),
    );
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackView,
      expect.any(Object),
    );
    fixture.detectChanges();
    tick(600);
    expect(component.formDirective().resetForm).toHaveBeenCalledTimes(1);
    expect(component.debtForm.reset).toHaveBeenCalledTimes(1);
  }));
  it('should handle success response from postNewDebt and user clicks "Cerrar"', fakeAsync(() => {
    const debt = {
      amount: 120,
      concept: 'Test',
      dueDate: new Date('2025-02-02'),
      emissionDate: new Date('2025-02-01'),
      code: '123',
      firstName: 'John',
    };
    component.debtForm.patchValue(debt);
    const successResponse = { success: true };
    jest
      .spyOn(homeServiceMock, 'postNewDebt')
      .mockReturnValue(of(successResponse));
    jest.spyOn(swalAlert, 'fire').mockResolvedValue({
      ...swalAlertMock,
      value: false,
      isConfirmed: false,
      isDismissed: true,
    });
    component.grabarNuevo();
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      expect.any(Object),
    );
    expect(trackingServiceMock.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackView,
      expect.any(Object),
    );
    fixture.detectChanges();
    tick(600);
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  }));

  it('should close the dialog on cerrarDialog', () => {
    component.cerrarDialog();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      grabado: component.grabado,
    });
  });
});
