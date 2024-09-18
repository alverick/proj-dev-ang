import { type OnInit, Component } from '@angular/core';
import {
  type UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import ExcelJS from 'exceljs';
import * as saveAs from 'file-saver';
import {
  isNilOrEmpty,
  isNotEmpty,
  isNotNil,
  isNotNilOrEmpty,
} from 'ramda-adjunct';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ServiceTypes } from '../../../../../../shared/constants/services';
import { type ServiceTypeType } from '../../../../../../shared/models';
import type { IErrorObj } from '../../../../../../shared/models/error.model';
import {
  type ProcessStatus,
  ExcelService,
} from '../../../../../../shared/services/excel.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../../../shared/utils/helpers/popups';
import { companyFeature } from '../../../../../../store/reducers/company.reducer';

@Component({
  selector: 'cs-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  isNewFlow = false;
  public inputXlsForm: UntypedFormGroup;
  public messageUploadExcel = false;
  public errores: any[] = [];
  public ready = false;
  public fileName: string;
  public cuadro_errores = true;
  private files: any;
  limitAmountMax: number;
  changestatus = true;
  uploaderFiles: File[] = [];

  public rowsAccepted = 0;
  public rowsRejected = 0;
  public progress = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };

  constructor(
    public excelService: ExcelService,
    public formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    private tracking: TrackingService,
    private store: Store
  ) {}

  ngOnInit() {
    this.inputXlsForm = this.formBuilder.group({
      xls: ['', Validators.required],
    });
    this.dialogRef.afterClosed().subscribe(() => {
      if (!this.excelService.statusUpload) {
        this.excelService.errores = [];
      }
    });
    this.store
      .select(companyFeature.selectCurrencyLimits)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((limits) => {
        this.limitAmountMax = limits.find(
          (limit) => limit.symbol === this.excelService.service.currencySymbol
        ).limitMax;
      });
    this.store
      .select(companyFeature.selectDetails)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((details) => {
        this.isNewFlow = details.isNewFlow;
      });
  }

  onChangeFile(event: Event) {
    console.log(event);
    const el = event.target as HTMLInputElement;
    let names: string[] = el.value.split('/');
    if (names.length <= 1) {
      names = el.value.split('\\');
    }
    this.fileName = names[names.length - 1];
    this.files = el.files;
    this.excelService.errores = [];
    this.ready = true;
  }

  private readonly rowStart = 14;

  validateFile() {
    return new Promise<IErrorObj[]>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;

        const workbook = new ExcelJS.Workbook();
        void workbook.xlsx
          .load(arrayBuffer)
          .then((workbook: ExcelJS.Workbook) => {
            const errors: IErrorObj[] = [];
            const limit = workbook.getWorksheet(1).rowCount;

            if (limit >= 5000 + this.rowStart) {
              errors.push({
                description:
                  'Se ha superado el límite de 5000 registros por archivo excel',
                row: 0,
              } as IErrorObj);
            }
            if (limit < this.rowStart) {
              errors.push({
                description: 'El archivo no contiene registros válidos',
                row: 0,
              } as IErrorObj);
            }

            const title = workbook.getWorksheet(1).getRow(2).getCell('B')
              .value as string;
            if (title.trim() !== this.excelService.service.name) {
              errors.push({
                description: 'El nombre del servicio no es correcto',
                row: 0,
              } as IErrorObj);
            }
            workbook
              .getWorksheet(1)
              .getRows(this.rowStart, limit - this.rowStart + 1)
              .forEach((row) => {
                errors.push(...this.validateRow(row));
              });
            resolve(errors);
          });
      };
      reader.readAsArrayBuffer(this.uploaderFiles[0]);
    });
  }

  validateRow(row: ExcelJS.Row) {
    const errors: IErrorObj[] = [];
    type withoutData = 'S';
    const fieldLabels: Record<
      Exclude<ServiceTypeType, withoutData>,
      string[]
    > = {
      [ServiceTypes.partial]: ['Código de cliente', 'Nombres', 'Servicio'],
      [ServiceTypes.complete]: [
        'Fecha de emisión',
        'Fecha de vencimiento',
        'Código de cliente',
        'Nombre del cliente',
        'Descripción',
        'Monto',
      ],
    };

    if (row.number === 14) {
      const cellTemplateText = row.getCell('G').value ?? '';
      if (
        cellTemplateText ===
        'Esto es un ejemplo, no olvides eliminar esta fila antes de subir tu archivo'
      ) {
        errors.push({
          description:
            'El archivo no contiene registros válidos, eliminar la fila de ejemplo',
          row: 0,
        } as IErrorObj);
      }
    }

    if (this.excelService.service.dataType === ServiceTypes.complete) {
      for (let idx = 1; idx <= 2; idx++) {
        if (!(row.getCell(idx).value instanceof Date)) {
          errors.push({
            description: `${
              fieldLabels[this.excelService.service.dataType][idx - 1]
            } no es una fecha válida`,
            row: row.number,
          } as IErrorObj);
        }
      }
      if (row.getCell(6).value <= 0 && isNotNil(row.getCell(6).value)) {
        errors.push({
          description: `${
            fieldLabels[this.excelService.service.dataType][5]
          } no es un monto válido`,
          row: row.number,
        } as IErrorObj);
      }
    }

    if (row.actualCellCount < 6) {
      (fieldLabels[this.excelService.service.dataType] as string[]).forEach(
        (col, index) => {
          if (isNilOrEmpty(row.getCell(index + 1).value)) {
            errors.push({
              description: `${col} debe tener un valor`,
              row: row.number,
            } as IErrorObj);
          }
        }
      );
    }

    return errors;
  }

  public removeFiled() {
    // console.log($event);
    this.uploaderFiles = [];
    this.excelService.errores = [];
  }

  public selectFiled({ currentFiles }: { currentFiles: File[] }) {
    // console.log($event);
    this.uploaderFiles = currentFiles;
    this.excelService.errores = [];
  }

  async openSnackBar() {
    if (!this.excelService.statusUpload) {
      const actionStep: Partial<ActionEventProperties> = {
        category: 'Home filtro',
        action: 'Click',
        label: 'Buscar',
        location: 'Filtro',
        step: 'Not available',
        state: 'Envío exitoso',
        metadata: [{ key: 'fileName', value: this.fileName }],
      };
      const validation = await this.validateFile();
      if (isNotEmpty(validation)) {
        this.excelService.errores = validation;
        return;
      }

      this.progress.status = 'Subiendo';
      this.progress.mode = 'indeterminate';
      this.progress.value = 0;
      this.excelService
        .UploadExcel(
          this.files,
          this.excelService.service.name,
          this.changestatus
        )
        .subscribe({
          next: (value) => {
            this.excelService.idProcess = value.id;
            this.verifyStatus();
          },
          error: (err) => {
            this.excelService.statusUpload = false;
            let message = err.message || 'Ha ocurrido un error';
            if (err.status === 400) {
              message = 'El nombre del archivo no es correcto';
              this.excelService.errores = [
                { description: 'El nombre del archivo no es correcto', row: 0 },
              ];
            }
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
              ...actionStep,
              state: 'Intento de envio',
              typeError: message as string,
            });
          },
        });
    } else {
      this.messageUploadExcel = this.excelService.statusUpload;
    }
  }

  close() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Cerrar agrega cobros del servicio',
      label: 'Cerrar',
      typeElement: 'Botón',
      location: 'Modal agregar cobro excel',
    });
    this.dialogRef.close();
  }

  private verifyStatus() {
    this.ready = true;
    const actionStep: Partial<ActionEventProperties> = {
      category: 'Home filtro',
      action: 'Click',
      label: 'Buscar',
      location: 'Filtro',
      step: 'Not available',
      state: 'Envío exitoso',
      metadata: [{ key: 'fileName', value: this.fileName }],
    };
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
        this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
          ...actionStep,
          state: 'Intento de envio',
          typeError: 'REJECTED',
        });
      } else if (value.status === 'FAILED') {
        const obsClose = new Observable((observer) => {
          this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
            ...actionStep,
            state: 'Intento de envio',
            typeError: 'FAILED',
          });
          void swalAlert.fire({
            title: 'Lo sentimos, no se pudo finalizar la carga de cobros',
            text: 'Por favor, revisa si algunos cobros se cargaron correctamente y luego inténtalo nuevamente.',
            showCloseButton: true,
            confirmButtonText: 'Ver cobros cargados',
            didClose: () => {
              observer.next();
              observer.complete();
            },
          });
        });
        this.excelService.statusUpload = false;
        this.dialogRef.close(obsClose);
      } else if (value.status === 'COMPLETED') {
        this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
        this.excelService.statusUpload = false;
        this.excelService.errores = [];
        const obsClose = new Observable((observer) => {
          let msg: string;
          if (this.excelService.service.dataType === 'C') {
            msg = `¡Listo! Se agregaron nuevas deudas `;
          } else {
            msg = `¡Listo! Se agregaron nuevos clientes`;
          }
          this.tracking.trackEvent(AdobeEvent.trackView, {
            category: msg,
            action: 'modal-view',
            detail:
              'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos.',
            location: 'Modal',
          });
          void swalAlert.fire({
            title: msg,
            text: 'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos.',
            showCloseButton: true,
            confirmButtonText: 'Cerrar',
            didClose: () => {
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

  gotoUploadTemplate() {
    this.ready = true;
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Ya tengo la plantilla excel',
      label: 'Ya tengo la plantilla',
      typeElement: 'Botón',
      location: 'Modal agregar cobro excel',
    });
  }

  downloadXlsTemplate() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Descargar la plantilla excel',
      label: 'Descargar la plantilla',
      typeElement: 'Botón',
      location: 'Modal agregar cobro excel',
    });
    this.excelService.GetTemplate().subscribe((r: Blob) => {
      saveAs(r, `Plantilla de carga - ${this.excelService.service.name}.xlsx`);
    });
  }
}
