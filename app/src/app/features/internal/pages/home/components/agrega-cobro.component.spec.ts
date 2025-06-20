import { CurrencyPipe } from '@angular/common';
import { MockBuilder, MockRender } from 'ng-mocks';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MessageAlertComponent } from '../../../../../shared/components/message-alert/message-alert.component';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { AgregaCobroComponent } from './agrega-cobro.component';

describe('AgregaCobroComponent', () => {
  let component: AgregaCobroComponent;

  beforeEach(async () => {
    await MockBuilder(AgregaCobroComponent)
      .mock(MessageAlertComponent)
      .mock(CurrencyPipe)
      .mock(ExcelService, {
        service: { currencySymbol: 'USD' },
      })
      .mock(DynamicDialogRef, {
        close: jest.fn(),
      })
      .mock(DynamicDialogConfig, {
        data: {
          useAmountLimits: true,
          amountLimits: [{ symbol: 'USD', limitMax: 1000 }],
        },
      });

    const fixture = MockRender(AgregaCobroComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize useAmountLimits correctly', () => {
    expect(component.useAmountLimits).toBe(true);
  });

  it('should set limitAmountMax correctly', () => {
    expect(component.limitAmountMax).toBe(1000);
  });

  it('should call dialogRef.close with web', () => {
    component.chooseWeb();
    expect(component.dialogRef.close).toHaveBeenCalledWith({ medio: 'web' });
  });

  it('should call dialogRef.close with excel', () => {
    component.chooseExcel();
    expect(component.dialogRef.close).toHaveBeenCalledWith({ medio: 'excel' });
  });
});
