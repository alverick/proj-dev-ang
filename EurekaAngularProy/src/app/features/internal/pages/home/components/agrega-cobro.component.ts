import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'cs-agrega-cobro',
  templateUrl: './agrega-cobro.component.html',
  styleUrls: ['./agrega-cobro.component.scss'],
})
export class AgregaCobroComponent {
  constructor(
    public excelService: ExcelService,
    public dialogRef: MatDialogRef<AgregaCobroComponent>
  ) {}

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
