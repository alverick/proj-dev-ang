import { OnInit, Component, AfterContentInit } from "@angular/core";
import { UploadProgressComponent } from "./upload-progress";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialogRef } from "@angular/material";
import { ExcelService } from "src/app/shared/services/excel.service";
import Swal from "sweetalert2";
import * as saveAs from 'file-saver';
import { drawPopup } from "src/app/shared/services/popups";
import { GoogleAnalytics } from "src/app/shared/services/googleAnalytics.service";
import { Observable } from "rxjs";


/*////////////////////////////////////////////////////////
///////////////// D I A L O G //////////////////////////
///////////////////////////////////////////////////////// */
declare var $: any;

@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'dialog.html',
    styleUrls:['dialog.scss']
  })

  // tslint:disable-next-line:component-class-suffix
  export class DialogComponent implements OnInit, AfterContentInit {
    public inputXlsForm: FormGroup;
    public xlsValid: boolean;
    public codigoCliente: String = 'Codigo de Cliente';
    public messageUploadExcel: boolean = false;
    public errores: any[] = [];
    public ready: boolean = false;
    public fileName: string;
    public cuadro_errores = true;

    constructor(public  snackBar: MatSnackBar,
                public excelService: ExcelService,
                public  formBuilder: FormBuilder,
                public  dialogRef: MatDialogRef<DialogComponent>,
                private gaService: GoogleAnalytics
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
     /* this.excelService.GetLastProcess()
        .subscribe(r => {
          if (r.status !== 'COMPLETED' && r.status !== 'REJECTED') {
            this.verifyStatus();
          }
        }); */
    }

    ngAfterContentInit() {
      $('.cdk-overlay-dark-backdrop').css('background-color', '#f3f3f3');
    }

    mostrarInput() {
      this.ready = true;
    }

    onChangeFile(event) {
      let el = event.target;
      let names: string[] = el.value.split("/");
      if (names.length <= 1)
        names = el.value.split("\\");
      this.fileName = names[names.length-1];
      this.files = el.files;
      this.excelService.errores = [];
      this.ready = true;
     // console.log('file name' + fileName);
    }

    SalirsnackBar() {
      this.dialogRef.close();
    }
    private files: any;
    get f(): any { return this.inputXlsForm.controls;}

     changestatus =true;

    openSnackBar() {
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
      this.ready = true;
      let recursiveFunc = (value) => {
        console.log('verify status dialog');
        if (!this.ready) return;
        if (value.status === "REJECTED") {
          this.excelService.statusUpload = false;
          this.rowsAccepted = value.rowsUploaded;
          this.rowsRejected = value.rowsRejected;
          this.excelService.errores = value.errors;
          this.cuadro_errores = true;
        } else if (value.status === 'COMPLETED') {
          this.gaService.sendEvent('CargarExcel', {
            'event_category': 'CargaExcel',
            'event_label': 'cargar_excel'
          });
          this.gaService.sendUrl('loteCargado', '/loteCargado');
          this.excelService.statusUpload = false;
          this.excelService.errores = [];
          var obsClose = new Observable(observer => {
            let msg = '';
            if(this.excelService.service.dataType === 'C'){
              // msg = `Se cargaron ${value.rowsUploaded} registros`;
              msg =  `¡Listo! Se agregaron nuevas deudas `
            }
            else {
              msg = `¡Listo! Se agregaron nuevos clientes`
            }
            Swal.fire({
              title:msg,
              text: 'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos',
              showCloseButton: true,
              onOpen: drawPopup,
              confirmButtonText:  'CERRAR',
              onAfterClose: () => { observer.next(); observer.complete(); }
            });
          });
          this.dialogRef.close(obsClose);
        } else {
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

    right() {
      console.log('cuadro');
      this.ready = true;
      if (this.excelService.errores.length > 0) {
        this.cuadro_errores = true;
      }
    }
    left() {
      console.log('cuadro');
      this.cuadro_errores = false;
      this.ready = false;
    }
    descargarPlantilla() {
      this.excelService.GetTemplate()
        .subscribe((r: Blob) => {
          this.gaService.sendEvent('DescargaPlantilla', {
            'event_category': 'CargaExcel',
            'event_label': 'descarga_plantilla'
          });
          saveAs(r, `Plantilla de carga - ${this.excelService.service.name}.xlsx`);
        });
    }
  }


