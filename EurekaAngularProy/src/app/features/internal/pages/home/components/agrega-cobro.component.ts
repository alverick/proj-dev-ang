import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { pathOr } from 'ramda';

import { MessageAlertComponent } from '../../../../../shared/components/message-alert/message-alert.component';
import type { CurrencyWithLimit } from '../../../../../shared/constants/currencies';
import { ExcelService } from '../../../../../shared/services/excel.service';

@Component({
  selector: 'cs-agrega-cobro',
  templateUrl: './agrega-cobro.component.html',
  styleUrls: ['./agrega-cobro.component.scss'],
  standalone: true,
  imports: [MessageAlertComponent, CurrencyPipe],
})
export class AgregaCobroComponent {
  limitAmountMax: number = null;
  useAmountLimits = false;
  constructor(
    public excelService: ExcelService,
    public dialogRef: DynamicDialogRef<AgregaCobroComponent>,
    public config: DynamicDialogConfig,
  ) {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.useAmountLimits = this.getUseAmountLimits();
    if (this.useAmountLimits) {
      this.limitAmountMax = this.getAmountLimitMax();
    }
  }

  private getUseAmountLimits(): boolean {
    return pathOr(false, ['data', 'useAmountLimits'], this.config);
  }

  private getAmountLimitMax(): number | null {
    const amountLimits = pathOr(
      [],
      ['data', 'amountLimits'],
      this.config,
    ) as CurrencyWithLimit[];
    const currencySymbol = this.excelService.service.currencySymbol;
    const limit = amountLimits.find((limit) => limit.symbol === currencySymbol);
    return limit ? limit.limitMax : null;
  }

  chooseWeb() {
    this.dialogRef.close({ medio: 'web' });
  }

  chooseExcel() {
    this.dialogRef.close({ medio: 'excel' });
  }
}
