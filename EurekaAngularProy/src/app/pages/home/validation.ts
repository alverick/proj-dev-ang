import { Component } from "@angular/core";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MatDialogRef } from "@angular/material";

@Component({
    selector: 'validation',
    templateUrl: 'validation.html',

  })

  export class ValidationComponent  {

    constructor(public excelService: ExcelService,
                 public dialog: MatDialogRef<ValidationComponent>) {
                 // dialog.disableClose = true;
                  }
      ocultar: boolean = true;

    verFila(err): boolean {
      return err.row > 0;
    }
  }
