import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { filter } from 'rxjs/operators';

import { ExcelService } from '../../../../../shared/services/excel.service';
import { companyFeature } from '../../../../../store/reducers/company.reducer';

@Component({
  selector: 'cs-agrega-cobro',
  templateUrl: './agrega-cobro.component.html',
  styleUrls: ['./agrega-cobro.component.scss'],
})
export class AgregaCobroComponent {
  limitAmountMax: number;
  isNewFlow = false;
  constructor(
    public excelService: ExcelService,
    public dialogRef: MatDialogRef<AgregaCobroComponent>,
    private store: Store
  ) {
    this.store
      .select(companyFeature.selectCurrencyLimits)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((limits) => {
        this.limitAmountMax = limits.find(
          (limit) => limit.symbol === this.excelService.service.currencySymbol
        ).limitMax;
      });
    this.store
      .select(companyFeature.selectDetails)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((details) => {
        this.isNewFlow = details.isNewFlow;
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
