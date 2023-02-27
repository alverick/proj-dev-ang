import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBarRef } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import Swal from 'sweetalert2';
import { ValidationComponent } from './validation';

@Component({
  selector: 'cs-upload-progress',
  templateUrl: 'upload-progress.html',
})
export class UploadProgressComponent implements OnInit {
  state = false;
  contador = 0;

  constructor(
    public dialog: MatDialog,
    public excelService: ExcelService,
    private snackRef: MatSnackBarRef<UploadProgressComponent>,
    private transactionService: TransactionService,
    private detectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    var th = this;
    var fnc = () => {
      if (th.excelService.idProcess > 0) {
        th.verifyStatus();
      } else {
        setTimeout(fnc, 500);
      }
    };
    setTimeout(fnc, 500);
  }

  //  const dialogRef =  this.dialog.open(ValidationComponent);

  private verifyStatus() {
    // tslint:disable-next-line:prefer-const
    let recursiveFunc = (value) => {
      if (value.status === 'REJECTED') {
        this.snackRef.dismiss();

        this.excelService.errores = value.errors;

        this.excelService.statusUpload = false;
        const dialogRef = this.dialog.open(ValidationComponent);
        // dialogRef.close(ValidationComponent);
        dialogRef.afterClosed().subscribe(() => {
          this.excelService.errores = [];
          this.excelService.idProcess = 0;
        });
      } else if (value.status === 'COMPLETED') {
        this.snackRef.dismiss();
        this.excelService.errores = [];
        this.excelService.idProcess = 0;
        this.excelService.statusUpload = false;
        if (value.rowsUploaded == 0) {
          Swal.fire({
            title: 'Ingrese Datos',
            icon: 'error',
            text: `Su archivo está vació`,
            showCloseButton: true,
          });
        } else {
          Swal.fire({
            icon: 'success',
            text: `Se cargaron ${value.rowsUploaded} registros`,
            showCloseButton: true,
          });

          this.transactionService.getDeuda().subscribe((debts) => {
            //this.detectorRef.detectChanges();
          });
        }
      } else {
        var th = this;
        setTimeout(() => {
          th.excelService
            .StatusExcel(th.excelService.idProcess)
            .subscribe(recursiveFunc);
        }, 2000);
      }
    };
    setTimeout(() => {
      this.excelService
        .StatusExcel(this.excelService.idProcess)
        .subscribe(recursiveFunc);
    }, 2000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.snackRef.dismiss();
  }
}
