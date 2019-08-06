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
  
    validationExcel = {
      'xls':[
        { type: 'required', message: 'Debes Ingresar un archivo excel'}
      ]
    }
  
    constructor(public  snackBar: MatSnackBar,
                private excelService: ExcelService,
                public  formBuilder: FormBuilder,
                public  dialogRef: MatDialogRef<DialogComponent>
  
              ) { }
  
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      this.inputXlsForm = this.formBuilder.group({
        xls: ['', Validators.required]
      });
  
      //this.SalirsnackBar();
      
    }
  
    onChangeFile(event) {
      this.files = event.target.files;
    }
  
    SalirsnackBar() {
      this.dialogRef.close();
    }
    private files: any;
    get f() { return this.inputXlsForm.controls;}
  
  
     openSnackBar() {
      if(this.inputXlsForm.valid) {
      /*service*/
      this.excelService.UploadExcel(this.files, this.excelService.service)
      .subscribe(
        value=> {
          this.excelService.idProcess = value.id;
         // console.table(value);
        }
      )
      // 
      console.log('se habre el sncack bar ');
      this.snackBar.openFromComponent(UploadProgressComponent);
      this.dialogRef.close();
      } else {
        this.xlsValid = true;
        
      }
    }
  
    close(){
      this.dialogRef.close();
    }
  }
  
  
  