import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MatDialog, MatSnackBarRef } from "@angular/material";
import { TransactionService } from "src/app/shared/services/transaction.service";
import { ValidationComponent } from "./validation";
import Swal from "sweetalert2";

@Component({
    selector: 'upload-progress',
    templateUrl: 'upload-progress.html',
  })
  
  export class UploadProgressComponent  implements OnInit  {
    state = false;
    contador = 0; 
  
    constructor( public dialog: MatDialog, public excelService: ExcelService,
                  private snackRef: MatSnackBarRef<UploadProgressComponent>,
                  private transactionService: TransactionService,
                  private detectorRef: ChangeDetectorRef) { }
  
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
  
        console.log(value.status);
        if (value.status === "REJECTED") {
          this.snackRef.dismiss();
  
          this.excelService.errores = value.errors;
          
          console.log('ABRE DIALOG')
          const dialogRef =  this.dialog.open(ValidationComponent);
         // dialogRef.close(ValidationComponent);
          dialogRef.afterClosed()
            .subscribe(() => {
              this.excelService.errores = [];
              this.excelService.idProcess = 0;
            });
          
        } else if (value.status === 'COMPLETED') {
          this.snackRef.dismiss();
          this.excelService.errores = [];
          this.excelService.idProcess = 0; 
          Swal.fire({
            type: 'success',
            text: `Se cargaron ${value.rowsUploaded} registros`
          });
          console.log("GET DEUDA HOME")
          this.transactionService.getDeuda()
          .subscribe(debts => {
            console.log(this.transactionService.debtItems);
            //this.detectorRef.detectChanges();
          });    
      
        } else  {
          var th = this;
          setTimeout(() => {
            th.excelService.StatusExcel(th.excelService.idProcess)
              .subscribe(recursiveFunc);
          }, 500);
          this.snackRef.dismiss();
        }
      };
      setTimeout(() => {
        this.excelService.StatusExcel(this.excelService.idProcess)
        .subscribe(recursiveFunc);
      }, 800);
      this.snackRef.dismiss();  
    }
    
   
    
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
      this.snackRef.dismiss();
    } 
  }
  
  