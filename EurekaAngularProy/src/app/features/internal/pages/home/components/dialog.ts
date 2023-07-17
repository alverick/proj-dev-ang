import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import * as saveAs from 'file-saver';
import { Observable } from 'rxjs';
import {
  ExcelService,
  ProcessStatus,
} from 'src/app/shared/services/excel.service';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';

@Component({
  selector: 'cs-dialog',
  templateUrl: 'dialog.html',
  styleUrls: ['dialog.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    public excelService: ExcelService,
    public formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    private gaService: GoogleAnalytics
  ) {}
  public inputXlsForm: UntypedFormGroup;
  public messageUploadExcel = false;
  public errores: any[] = [];
  public ready = false;
  public fileName: string;
  public cuadro_errores = true;
  private files: any;

  changestatus = true;

  public rowsAccepted = 0;
  public rowsRejected = 0;
  public progress: any = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };

  ngOnInit() {
    this.inputXlsForm = this.formBuilder.group({
      xls: ['', Validators.required],
    });
    this.dialogRef.afterClosed().subscribe(() => {
      if (!this.excelService.statusUpload) {
        this.excelService.errores = [];
      }
    });
  }

  onChangeFile(event) {
    const el = event.target;
    let names: string[] = el.value.split('/');
    if (names.length <= 1) {
      names = el.value.split('\\');
    }
    this.fileName = names[names.length - 1];
    this.files = el.files;
    this.excelService.errores = [];
    this.ready = true;
  }

  openSnackBar() {
    if (!this.excelService.statusUpload) {
      this.progress.status = 'Subiendo';
      this.progress.mode = 'indeterminate';
      this.progress.value = 0;
      this.excelService
        .UploadExcel(
          this.files,
          this.excelService.service.name,
          this.changestatus
        )
        .subscribe(
          (value) => {
            this.excelService.idProcess = value.id;
            this.verifyStatus();
          },
          (err) => {
            this.excelService.statusUpload = false;
            if (err.status === 400) {
              this.excelService.errores = [
                { description: 'El nombre del archivo no es correcto', row: 0 },
              ];
            }
          }
        );
    } else {
      this.messageUploadExcel = this.excelService.statusUpload;
    }
  }

  close() {
    this.dialogRef.close();
  }

  private verifyStatus() {
    this.ready = true;
    const recursiveFunc = (value: ProcessStatus) => {
      if (!this.ready) {
        return;
      }
      if (value.status === 'REJECTED') {
        this.excelService.statusUpload = false;
        this.rowsAccepted = value.rowsUploaded;
        this.rowsRejected = value.rowsRejected;
        this.excelService.errores = value.errors;
        this.cuadro_errores = true;
      } else if (value.status === 'FAILED') {
        void swalAlert.fire({
          title: 'Carga de cobros',
          text: 'Por favor, revise si los cobros se cargaron correctamente o vuelva a intentarlo.',
          showCloseButton: true,
          confirmButtonText: 'CERRAR',
        });
        this.excelService.statusUpload = false;
        this.dialogRef.close();
      } else if (value.status === 'COMPLETED') {
        this.gaService.sendEvent('CargarExcel', {
          event_category: 'CargaExcel',
          event_label: 'cargar_excel',
        });
        this.gaService.sendUrl('loteCargado', '/loteCargado');
        this.excelService.statusUpload = false;
        this.excelService.errores = [];
        const obsClose = new Observable((observer) => {
          let msg: string;
          if (this.excelService.service.dataType === 'C') {
            msg = `¡Listo! Se agregaron nuevas deudas `;
          } else {
            msg = `¡Listo! Se agregaron nuevos clientes`;
          }
          Swal.fire({
            title: msg,
            text: 'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos',
            showCloseButton: true,
            onOpen: drawPopup,
            confirmButtonText: 'CERRAR',
            onAfterClose: () => {
              observer.next();
              observer.complete();
            },
          });
        });
        this.dialogRef.close(obsClose);
      } else {
        this.progress.mode = 'determinate';
        this.progress.value = value.advance;
        if (value.status === 'VALIDATING') {
          this.progress.status = `Validando (${value.phase}/3)`;
        } else if (value.status === 'SAVING') {
          this.progress.status = `Grabando (${value.phase}/2)`;
        }
        const th = this;
        setTimeout(() => {
          th.excelService
            .StatusExcel(th.excelService.idProcess)
            .subscribe(recursiveFunc);
        }, 2000);
      }
    };
    this.progress.mode = 'determinate';
    this.progress.value = 0;
    this.progress.status = 'Validando (0/3)';
    setTimeout(() => {
      this.excelService
        .StatusExcel(this.excelService.idProcess)
        .subscribe(recursiveFunc);
    }, 2000);
  }

  right() {
    this.ready = true;
    if (this.excelService.errores.length > 0) {
      this.cuadro_errores = true;
    }
  }
  left() {
    this.cuadro_errores = false;
    this.ready = false;
  }
  descargarPlantilla() {
    this.excelService.GetTemplate().subscribe((r: Blob) => {
      this.gaService.sendEvent('DescargaPlantilla', {
        event_category: 'CargaExcel',
        event_label: 'descarga_plantilla',
      });
      saveAs(r, `Plantilla de carga - ${this.excelService.service.name}.xlsx`);
    });
  }
}
