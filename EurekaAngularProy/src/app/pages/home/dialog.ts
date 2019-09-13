import { OnInit, Component } from "@angular/core";
import { UploadProgressComponent } from "./upload-progress";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialogRef } from "@angular/material";
import { ExcelService } from "src/app/shared/services/excel.service";
import Swal from "sweetalert2";
import * as saveAs from 'file-saver';


/*////////////////////////////////////////////////////////
///////////////// D I A L O G //////////////////////////
///////////////////////////////////////////////////////// */


@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'dialog.html',
  })

  // tslint:disable-next-line:component-class-suffix
  export class DialogComponent implements OnInit {
    public inputXlsForm: FormGroup;
    public xlsValid: boolean;
    public codigoCliente: String = 'Codigo de Cliente';
    public messageUploadExcel: boolean = false;

    validationExcel = {
      'xls':[
        { type: 'required', message: 'Debes Ingresar un archivo excel'}
      ]
    }

    constructor(public  snackBar: MatSnackBar,
                private excelService: ExcelService,
                public  formBuilder: FormBuilder,
                public  dialogRef: MatDialogRef<DialogComponent>

              ) {
               }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      this.inputXlsForm = this.formBuilder.group({
        xls: ['', Validators.required]
      });



    }


     /*Data Completa */
    matricula: any = [{"Fecha de emisión":"17/8/2019","Fecha de vencimiento":"16/9/2019",
    "Código de cliente":"u2019000001","Nombres":"Nombre Demo", "Apellidos":"apellido Demo",
    "Servicio":"Matricula","Concepto": "20190708","Monto":"500"}];


    onChangeFile(event) {
      this.files = event.target.files;
    }

    SalirsnackBar() {
      this.dialogRef.close();
    }
    private files: any;
    get f() { return this.inputXlsForm.controls;}

     changestatus =true;
     openSnackBar() {

       console.log("ENTRO : " + this.inputXlsForm.value)
      if(this.inputXlsForm.valid) {
        this.xlsValid= false;
      /*service*/

        if(this.excelService.statusUpload == false) {
          console.log("SERVICE");
          console.log(this.excelService.service);
          this.excelService.UploadExcel(this.files, this.excelService.service.name, this.changestatus )
          .subscribe(value => {
              this.excelService.idProcess = value.id;

              this.snackBar.openFromComponent(UploadProgressComponent);
              this.dialogRef.close();
          }, err => {
            this.excelService.statusUpload = false;
            this.snackBar.dismiss();
            if (err.status === 400) {
              Swal.fire({
                type: 'error',
                title: 'Carga de Excel',
                text: 'El nombre del archivo no es correcto'
              });
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

    exportDataMatriculaXLSX() {
      console.log('exportDataMatriculaXLSX');
      this.excelService.GetTemplate()
        .subscribe((r: Blob) => {
          saveAs(r, `Plantilla de carga - ${this.excelService.service.name}.xlsx`);
        });
    }

    OcultarMensaje() {
      this.xlsValid = false;
    }
  }


