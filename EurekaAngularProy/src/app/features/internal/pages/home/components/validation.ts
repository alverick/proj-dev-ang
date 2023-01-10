import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'cs-validation',
  templateUrl: 'validation.html',
})
export class ValidationComponent {
  constructor(
    public excelService: ExcelService,
    public dialog: MatDialogRef<ValidationComponent>
  ) {
    // dialog.disableClose = true;
  }
  ocultar: boolean = true;

  verFila(err): boolean {
    return err.row > 0;
  }
}
