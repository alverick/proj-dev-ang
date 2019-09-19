import { OnInit, Component } from "@angular/core";
import { UploadProgressComponent } from "./upload-progress";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialogRef } from "@angular/material";
import { ExcelService } from "src/app/shared/services/excel.service";
import Swal from "sweetalert2";
import * as saveAs from 'file-saver';
import { drawPopup } from "src/app/shared/services/popups";


/*////////////////////////////////////////////////////////
///////////////// D I A L O G //////////////////////////
///////////////////////////////////////////////////////// */


@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'dialog.html',
    styleUrls:['dialog.scss']
  })

  // tslint:disable-next-line:component-class-suffix
  export class DialogComponent implements OnInit {
    public inputXlsForm: FormGroup;
    public xlsValid: boolean;
    public codigoCliente: String = 'Codigo de Cliente';
    public messageUploadExcel: boolean = false;
    public errores: any[] = [];
    public ready: boolean = false;

    constructor(public  snackBar: MatSnackBar,
                public excelService: ExcelService,
                public  formBuilder: FormBuilder,
                public  dialogRef: MatDialogRef<DialogComponent>

              ) {
               }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      this.inputXlsForm = this.formBuilder.group({
        xls: ['', Validators.required]
      });
      this.dialogRef.afterClosed()
        .subscribe(() => {
          if (!this.excelService.statusUpload) {
            this.excelService.errores = [];
          }
        });
    }

    mostrarInput() {
      this.ready = true;
    }

    onChangeFile(event) {
      this.files = event.target.files;
      this.excelService.errores = [];
    }

    SalirsnackBar() {
      this.dialogRef.close();
    }
    private files: any;
    get f(): any { return this.inputXlsForm.controls;}

     changestatus =true;
     openSnackBar() {

      if(this.inputXlsForm.valid) {
        this.xlsValid= false;
      /*service*/

        if(this.excelService.statusUpload == false) {
          this.progress.status = "Subiendo";
          this.progress.mode = 'indeterminate';
          this.progress.value = 0;
          this.excelService.UploadExcel(this.files, this.excelService.service.name, this.changestatus )
          .subscribe(value => {
            this.excelService.idProcess = value.id;
            this.verifyStatus();
          }, err => {
            this.excelService.statusUpload = false;
            if (err.status === 400) {
              this.excelService.errores = [
                { description: 'El nombre del archivo no es correcto', row: 0 }
              ];
            }
          });
        } else {

          this.messageUploadExcel =this.excelService.statusUpload;
          return;
        }

      } else {
        this.xlsValid = true;

      }
    }


    close(){
      this.dialogRef.close();
    }

    public rowsAccepted: number = 0;
    public rowsRejected: number = 0;
    public progress: any = {
      status: 'Subiendo',
      mode: 'indeterminate',
      value: 0
    };

    private verifyStatus() {
      let recursiveFunc = (value) => {
        if (value.status === "REJECTED") {
          this.excelService.statusUpload = false;
          this.rowsAccepted = value.rowsUploaded;
          this.rowsRejected = value.rowsRejected;
          this.excelService.errores = value.errors;
        }
        else if (value.status === 'COMPLETED') {
          this.excelService.statusUpload = false;
          this.excelService.errores = [];
          this.dialogRef.close();
          Swal.fire({
            text: `Se cargaron ${value.rowsUploaded} registros`,
            showCloseButton: true,
            onOpen: drawPopup
          });
        }
        else {
          this.progress.mode = 'determinate';
          this.progress.value = value.advance;
          if (value.status == "VALIDATING") {
            this.progress.status = `Validando (${value.phase}/3)`;
          }
          else if (value.status == "SAVING") {
            this.progress.status = `Grabando (${value.phase}/2)`;
          }
          var th = this;
          setTimeout(() => {
            th.excelService.StatusExcel(th.excelService.idProcess)
              .subscribe(recursiveFunc);
          }, 500);
        }
      };
      this.progress.mode = 'determinate';
      this.progress.value = 0;
      this.progress.status = 'Validando (0/3)';
      setTimeout(() => {
        this.excelService.StatusExcel(this.excelService.idProcess)
        .subscribe(recursiveFunc);
      }, 800);
    }

    descargarPlantilla() {
      this.excelService.GetTemplate()
        .subscribe((r: Blob) => {
          saveAs(r, `Plantilla de carga - ${this.excelService.service.name}.xlsx`);
        });
    }
  }


