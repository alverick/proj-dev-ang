import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, type OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { type FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { Ripple } from 'primeng/ripple';
import { isNil, isNotEmpty, pathOr } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';

import { MessageAlertComponent } from '../../../../../../shared/components/message-alert/message-alert.component';
import type { CurrencyWithLimit } from '../../../../../../shared/constants/currencies';
import { processStatus } from '../../../../../../shared/constants/process';
import { ServiceTypes } from '../../../../../../shared/constants/services';
import { type ServiceTypeType } from '../../../../../../shared/models';
import type { IErrorObj } from '../../../../../../shared/models/error.model';
import {
  ExcelService,
  type ProcessStatus,
} from '../../../../../../shared/services/excel.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../../../shared/utils/helpers/popups';

@Component({
  selector: 'cs-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
  standalone: true,
  imports: [
    MessageAlertComponent,
    ProgressBarModule,
    FileUploadModule,
    PrimeTemplate,
    ButtonDirective,
    Ripple,
    CurrencyPipe,
  ],
})
export class DialogComponent implements OnInit {
  useAmountLimits = false;
  public inputXlsForm: UntypedFormGroup;
  public messageUploadExcel = false;
  public ready = false;
  public fileName: string;
  public cuadro_errores = true;
  limitAmountMax: number = null;
  uploaderFiles: File[] = [];
  confirmUser = false;
  public rowsAccepted = 0;
  public rowsRejected = 0;
  public progress = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };
  private readonly rowStart = 14;

  constructor(
    public excelService: ExcelService,
    public formBuilder: UntypedFormBuilder,
    public dialogRef: DynamicDialogRef<DialogComponent>,
    private tracking: TrackingService,
    public config: DynamicDialogConfig,
    private store: Store,
  ) {}

  ngOnInit() {
    this.inputXlsForm = this.formBuilder.group({
      xls: ['', Validators.required],
    });
    this.dialogRef.onClose.subscribe(() => {
      if (!this.excelService.statusUpload) {
        this.excelService.errores = [];
      }
    });

    this.useAmountLimits = pathOr(
      false,
      ['data', 'useAmountLimits'],
      this.config,
    );

    if (this.useAmountLimits) {
      this.limitAmountMax = (
        pathOr([], ['data', 'amountLimits'], this.config) as CurrencyWithLimit[]
      ).find(
        (limit) => limit.symbol === this.excelService.service.currencySymbol,
      )?.limitMax;
    }
  }

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

            if (limit < this.rowStart) {
              errors.push({
                description: 'El archivo no contiene registros válidos',
                row: 0,
              } as IErrorObj);
              resolve(errors);
              return;
            }

            if (limit >= 5000 + this.rowStart) {
              errors.push({
                description:
                  'Se ha superado el límite de 5000 registros por archivo excel',
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
      [ServiceTypes.partial]: ['Código de cliente', 'Nombre del cliente'],
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
          let isNotValidDate = true;
          if (typeof row.getCell(idx).value === 'string') {
            const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
            const dt = new Date(
              (row.getCell(idx).value as string).replace(pattern, '$3-$2-$1'),
            );
            if (dt instanceof Date) {
              isNotValidDate = false;
            }
          }
          if (isNotValidDate) {
            errors.push({
              description: `${
                fieldLabels[this.excelService.service.dataType][idx - 1]
              } no es una fecha válida`,
              row: row.number,
            } as IErrorObj);
          }
        }
      }
      if (this.validateAmountZero(row)) {
        errors.push({
          description: `${
            fieldLabels[this.excelService.service.dataType][5]
          } no es un monto válido`,
          row: row.number,
        } as IErrorObj);
      }
    }

    const checkAllCols =
      this.excelService.service.dataType === ServiceTypes.complete ? 6 : 2;

    if (row.actualCellCount < checkAllCols) {
      (fieldLabels[this.excelService.service.dataType] as string[]).forEach(
        (col, index) => {
          if (isNilOrEmpty(row.getCell(index + 1).value)) {
            errors.push({
              description: `${col} debe tener un valor`,
              row: row.number,
            } as IErrorObj);
          }
        },
      );
    }

    return errors;
  }

  private validateAmountZero(row: ExcelJS.Row) {
    let value = row.getCell(6).value;

    if (isNil(value)) {
      return false;
    }

    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    if (typeof value !== 'number') {
      return true;
    }
    return value <= 0;
  }

  public removeFiled() {
    this.uploaderFiles = [];
    this.excelService.errores = [];
  }

  public selectFiled({ currentFiles }: { currentFiles: File[] }) {
    this.uploaderFiles = currentFiles;
    // this.excelService.errores = [];
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
      if (this.confirmUser) {
        this.confirmUser = false;
        this.excelService.confirmUser(this.uploaderFiles).subscribe(() => {
          this.verifyStatus();
        });
      } else {
        this.excelService.UploadExcel(this.uploaderFiles).subscribe({
          next: (value) => {
            this.excelService.idProcess = value.idProcess;
            this.verifyStatus();
          },
          error: (err: HttpErrorResponse) => {
            this.excelService.statusUpload = false;
            let message = err.message || 'Ha ocurrido un error';
            if (err.status === 400) {
              message = 'El nombre del archivo no es correcto';
              this.excelService.errores = [
                {
                  description: 'El nombre del archivo no es correcto',
                  row: 0,
                },
              ];
            }
            this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
              ...actionStep,
              state: 'Intento de envio',
              typeError: message,
            });
          },
        });
      }
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
      if (
        value.status === processStatus.rejected ||
        value.status === processStatus.confirmUser
      ) {
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
        if (value.status === processStatus.confirmUser) {
          this.confirmUser = true;
        }
      } else if (value.status === processStatus.failed) {
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
      } else if (value.status === processStatus.completed) {
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
        setTimeout(() => {
          this.excelService
            .StatusExcel(this.excelService.idProcess)
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

  getSizeInMegaBytes(file: File) {
    return file ? file.size / 1000000 : 0;
  }

  removeFile(file: File, uploader: FileUpload) {
    const index = uploader.files.indexOf(file);
    uploader.remove(null, index);
  }
}
