import { OnInit, Component } from "@angular/core";
import { DebtsPagedList } from "src/app/shared/models/debts";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MatDialog, MatSnackBarRef } from "@angular/material";
import { TransactionService } from "src/app/shared/services/transaction.service";
import Swal from "sweetalert2";
import { ValidationComponent } from "./validation";

@Component({
    selector: 'upload-progress',
    templateUrl: 'upload-progress.html',
  })
  
  export class UploadProgressComponent  implements OnInit  {
    state = false;
    contador = 0; 
  
  
    debtsList: DebtsPagedList;
  
    constructor( public dialog: MatDialog, public excelService: ExcelService,
                  private snackRef: MatSnackBarRef<UploadProgressComponent>,
                  private transactionService: TransactionService) { }
  
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
   
    private verifyStatus() {
  
      let recursiveFunc = (value) => {
  
        console.log(value.status);
        if (value.status === "REJECTED") {
          this.snackRef.dismiss();
  
          this.excelService.errores = value.errors;
          console.table(value.errors);
          console.log('ABRE DIALOG')
          const dialogRef =  this.dialog.open(ValidationComponent);
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
            console.log(debts);
        });
          
        } else  {
          var th = this;
          setTimeout(() => {
            this.snackRef.dismiss();
            th.excelService.StatusExcel(th.excelService.idProcess)
              .subscribe(recursiveFunc);
          }, 500);
  
        }
      };
      setTimeout(() => {
        this.snackRef.dismiss();
        this.excelService.StatusExcel(this.excelService.idProcess)
        .subscribe(recursiveFunc);
      }, 800);
  
    }
  
    ngOnDestroy() {
      this.snackRef.dismiss();
    } 
  }