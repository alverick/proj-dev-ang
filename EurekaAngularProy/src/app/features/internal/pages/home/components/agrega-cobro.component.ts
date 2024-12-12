import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { filter } from 'rxjs/operators';

import { MessageAlertComponent } from '../../../../../shared/components/message-alert/message-alert.component';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { companyFeature } from '../../../../../store/reducers/company.reducer';

@Component({
  selector: 'cs-agrega-cobro',
  templateUrl: './agrega-cobro.component.html',
  styleUrls: ['./agrega-cobro.component.scss'],
  standalone: true,
  imports: [MessageAlertComponent, CurrencyPipe],
})
export class AgregaCobroComponent {
  limitAmountMax: number;
  useAmountLimits = false;
  constructor(
    public excelService: ExcelService,
    public dialogRef: DynamicDialogRef<AgregaCobroComponent>,
    private store: Store,
  ) {
    this.store
      .select(companyFeature.selectCurrencyLimits)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((limits) => {
        this.limitAmountMax = limits.find(
          (limit) => limit.symbol === this.excelService.service.currencySymbol,
        )?.limitMax;
      });
    this.store
      .select(companyFeature.selectUseAmountLimits)
      .subscribe((useLimits) => {
        this.useAmountLimits = useLimits;
      });
  }

  close() {
    this.dialogRef.close();
  }

  chooseWeb() {
    this.dialogRef.close({ medio: 'web' });
  }

  chooseExcel() {
    this.dialogRef.close({ medio: 'excel' });
  }
}
