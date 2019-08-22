import { OnInit, Component } from "@angular/core";
import { UploadProgressComponent } from "./upload-progress";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialogRef } from "@angular/material";
import { ExcelService } from "src/app/shared/services/excel.service";



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
          .subscribe(
            value=> {
              this.excelService.idProcess = value.id;

            });
        } else {
            
          this.messageUploadExcel =this.excelService.statusUpload;
          return;
        }

      this.snackBar.openFromComponent(UploadProgressComponent);
      this.dialogRef.close();
      } else {
        this.xlsValid = true;

      }
    }
    

    close(){
      this.dialogRef.close();
    }

    exportDataMatriculaXLSX():void{
      this.excelService.exportAsExcelFile(this.matricula, 'data_completa');
    }

    OcultarMensaje() {
      this.xlsValid = false;
    }
  }


