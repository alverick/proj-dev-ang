import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, type OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
import { Observable, switchMap, takeWhile, timer } from 'rxjs';

import { MessageAlertComponent } from '../../../../../../shared/components/message-alert/message-alert.component';
import type { CurrencyWithLimit } from '../../../../../../shared/constants/currencies';
import {
  fileUploadExampleTest,
  fileUploadExampleTestMessage,
} from '../../../../../../shared/constants/fileload-messages';
import {
  processStatus,
  StatusValues,
} from '../../../../../../shared/constants/process';
import { ServiceTypes } from '../../../../../../shared/constants/services';
import { SingleClickDirective } from '../../../../../../shared/directives/single-click.directive';
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

type withoutData = 'S';

@Component({
    selector: 'cs-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss'],
    imports: [
        MessageAlertComponent,
        ProgressBarModule,
        FileUploadModule,
        PrimeTemplate,
        ButtonDirective,
        Ripple,
        CurrencyPipe,
        DecimalPipe,
        NgClass,
        SingleClickDirective,
    ]
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
  lastRows: number[] = [];
  confirmUser = false;
  public rowsAccepted = 0;
  public rowsRejected = 0;
  public progress = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };
  fieldLabels: Record<Exclude<ServiceTypeType, withoutData>, string[]> = {
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
  rowStart = computed(() => {
    return this.excelService.service.dataType === ServiceTypes.complete
      ? 14
      : 10;
  });

  constructor(
    public excelService: ExcelService,
    public formBuilder: UntypedFormBuilder,
    public dialogRef: DynamicDialogRef<DialogComponent>,
    private readonly tracking: TrackingService,
    public config: DynamicDialogConfig,
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
    const notValidRows = {
      description: 'El archivo no contiene registros válidos',
      row: 0,
    };

    return new Promise<IErrorObj[]>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        let errors: IErrorObj[] = [];
        const limit = workbook.getWorksheet(1).rowCount;

        if (limit < this.rowStart()) {
          resolve([notValidRows]);
          return;
        }
        errors = errors.concat(this.validateWorkBook(workbook));
        if (this.lastRows.includes(workbook.getWorksheet(1).lastRow.number)) {
          if (limit - this.rowStart() + 1 === this.lastRows.length) {
            resolve([notValidRows]);
            return;
          }
          resolve(errors.filter((error) => !this.lastRows.includes(error.row)));
        }
        resolve(errors);
      };
      reader.readAsArrayBuffer(this.uploaderFiles[0]);
    });
  }

  private validateWorkBook(workbook: ExcelJS.Workbook) {
    const errors: IErrorObj[] = [];
    const limit = workbook.getWorksheet(1).rowCount;

    if (limit >= 5000 + this.rowStart()) {
      errors.push({
        description:
          'Se ha superado el límite de 5000 registros por archivo excel',
        row: 0,
      });
    }

    const title = workbook.getWorksheet(1).getRow(2).getCell('B')
      .value as string;
    if (title.trim() !== this.excelService.service.name) {
      errors.push({
        description: 'El nombre del servicio no es correcto',
        row: 0,
      });
    }
    workbook
      .getWorksheet(1)
      .getRows(this.rowStart(), limit - this.rowStart() + 1)
      .forEach((row) => {
        const errorObjs = this.validateRow(row);
        if (errorObjs.length > 0 && this.checkLastEmptyRows(errorObjs)) {
          this.lastRows.push(row.number);
        }
        errors.push(...errorObjs);
      });
    return errors;
  }

  validateRow(row: ExcelJS.Row) {
    const errors: IErrorObj[] = [];
    const fieldLabels = this.fieldLabels[
      this.excelService.service.dataType
    ] as string[];

    if (row.number === this.rowStart()) {
      const column =
        this.excelService.service.dataType === ServiceTypes.complete
          ? 'G'
          : 'C';
      const cellTemplateText = row.getCell(column).value ?? '';
      if (cellTemplateText === fileUploadExampleTest) {
        errors.push({
          description: fileUploadExampleTestMessage,
          row: 0,
        });
      }
    }

    if (this.excelService.service.dataType === ServiceTypes.complete) {
      for (let idx = 1; idx <= 2; idx++) {
        if (this.validateDateCell(row, idx)) {
          errors.push({
            description: `${fieldLabels[idx - 1]} no es una fecha válida`,
            row: row.number,
          });
        }
      }
      if (this.validateAmountZero(row)) {
        errors.push({
          description: `${fieldLabels[5]} no es un monto válido`,
          row: row.number,
        });
      }
    }

    const checkAllCols =
      this.excelService.service.dataType === ServiceTypes.complete ? 6 : 2;

    if (row.actualCellCount < checkAllCols) {
      fieldLabels.forEach((col, index) => {
        if (isNilOrEmpty(row.getCell(index + 1).value)) {
          errors.push({
            description: `${col} debe tener un valor`,
            row: row.number,
          });
        }
      });
    }

    return errors;
  }

  protected validateDateCell(row: ExcelJS.Row, idx: number) {
    if (row.getCell(idx).value instanceof Date) {
      return false;
    }

    let isNotValidDate = true;
    if (typeof row.getCell(idx).value === 'string') {
      const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      const dt = new Date(
        (row.getCell(idx).value as string).replace(pattern, '$3-$2-$1'),
      );
      if (dt instanceof Date && dt.toString() !== 'Invalid Date') {
        isNotValidDate = false;
      }
    }
    return isNotValidDate;
  }

  protected validateAmountZero(row: ExcelJS.Row) {
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
    this.confirmUser = false;
  }

  public selectFiled({ currentFiles }: { currentFiles: File[] }) {
    this.uploaderFiles = currentFiles;
  }

  async openSnackBar() {
    if (this.excelService.statusUpload) {
      this.messageUploadExcel = this.excelService.statusUpload;
      return;
    }

    const actionStep: Partial<ActionEventProperties> = {
      category: 'Home filtro',
      action: 'Click',
      label: 'Buscar',
      location: 'Filtro',
      step: 'Not available',
      state: 'Envío exitoso',
      metadata: [{ key: 'fileName', value: this.fileName }],
    };

    const validationErrors = await this.validateFile();
    if (isNotEmpty(validationErrors)) {
      this.excelService.errores = validationErrors;
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
  }

  checkLastEmptyRows(errors: IErrorObj[]) {
    const fieldLabels = this.fieldLabels[
      this.excelService.service.dataType
    ] as string[];
    let isEmptyRow = true;
    errors.forEach((errorsRow, idx) => {
      if (errorsRow.description !== `${fieldLabels[idx]} debe tener un valor`) {
        isEmptyRow = false;
      }
    });
    return isEmptyRow;
  }

  protected verifyStatus() {
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

    this.initializeProgress();

    timer(0, 2000)
      .pipe(
        switchMap(() =>
          this.excelService.StatusExcel(this.excelService.idProcess),
        ),
        takeWhile((status) => this.isProcessing(status), true),
      )
      .subscribe({
        next: (status) => this.handleStatus(status, actionStep),
        complete: () => console.log('Process completed'),
      });
  }

  private isProcessing(status: ProcessStatus): boolean {
    const terminalStatuses = new Set<StatusValues>([
      processStatus.rejected,
      processStatus.confirmUser,
      processStatus.failed,
      processStatus.completed,
    ]);

    return !terminalStatuses.has(status.status);
  }

  private handleStatus(
    value: ProcessStatus,
    actionStep: Partial<ActionEventProperties>,
  ) {
    if (!this.ready) return;

    switch (value.status) {
      case processStatus.rejected:
      case processStatus.confirmUser:
        this.handleRejectedStatus(value, actionStep);
        break;

      case processStatus.failed:
        this.handleFailedStatus(actionStep);
        break;

      case processStatus.completed:
        this.handleCompletedStatus(actionStep);
        break;

      default:
        this.handleInProgressStatus(value);
    }
  }

  private handleRejectedStatus(
    value: ProcessStatus,
    actionStep: Partial<ActionEventProperties>,
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
  }

  private handleFailedStatus(actionStep: Partial<ActionEventProperties>) {
    this.excelService.statusUpload = false;

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

    this.dialogRef.close(obsClose);
  }

  private handleCompletedStatus(actionStep: Partial<ActionEventProperties>) {
    this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
    this.excelService.statusUpload = false;
    this.excelService.errores = [];

    const obsClose = new Observable((observer) => {
      const msg =
        this.excelService.service.dataType === 'C'
          ? '¡Listo! Se agregaron nuevas deudas'
          : '¡Listo! Se agregaron nuevos clientes';

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
  }

  private handleInProgressStatus(value: ProcessStatus) {
    this.progress.mode = 'determinate';
    this.progress.value = value.advance;

    const phaseMapping: Record<string, string> = {
      VALIDATING: `Validando (${value.phase}/3)`,
      SAVING: `Grabando (${value.phase}/2)`,
    };

    this.progress.status = phaseMapping[value.status] || 'Procesando';
  }

  private initializeProgress() {
    this.progress.mode = 'determinate';
    this.progress.value = 0;
    this.progress.status = 'Validando (0/3)';
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
