import {
  type ComponentRef,
  EventEmitter,
  inject,
  Injectable,
  type ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';

import { internalFullRoutingNames } from '../../app-routing.collection';
import { LoadFileComponent } from '../components/load-file/load-file.component';
import { processStatus, StatusValues } from '../constants/process';
import { ExcelService, type ProcessStatus } from './excel.service';

export interface ModalCloseData {
  status: StatusValues;
  rowsAccepted: number;
  rowsRejected: number;
  dataType: string;
}

@Injectable()
export class LoadFileService {
  private readonly excelService = inject(ExcelService);
  private readonly router = inject(Router);

  private componentRef: ComponentRef<LoadFileComponent> = null;
  private cancel = true;
  public onClose = new EventEmitter<Partial<ModalCloseData>>();

  public verify(container: ViewContainerRef) {
    container.clear();
    if (this.excelService.isProcessActive()) {
      this.componentRef = container.createComponent(LoadFileComponent);
      this.verifyStatus();
    } else {
      this.excelService.GetLastProcess().subscribe({
        next: (process) => {
          const finalStatuses: StatusValues[] = [
            processStatus.completed,
            processStatus.rejected,
            processStatus.failed,
            processStatus.confirmUser,
          ];

          if (!finalStatuses.includes(process.status)) {
            this.excelService.startUpload(process.id);
            this.componentRef = container.createComponent(LoadFileComponent);
            this.verifyStatus();
          }
        },
        error: () => {
          this.componentRef = null;
        },
      });
    }
  }

  public isRunning() {
    return this.componentRef !== null && this.componentRef !== undefined;
  }

  public close() {
    if (this.componentRef) {
      this.cancel = true;
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private verifyStatus() {
    const stop$ = new Subject();
    this.cancel = false;

    const delayBy = 2000;
    const stopLoop = () => {
      stop$.next(true);
      stop$.complete();
    };
    this.componentRef.instance.progress.mode = 'determinate';
    this.componentRef.instance.progress.value = 0;
    this.componentRef.instance.progress.status = 'Validando (0/3)';
    this.excelService
      .StatusExcel(this.excelService.idProcess)
      .pipe(repeat({ delay: delayBy }), takeUntil(stop$))
      .subscribe(
        ({
          advance,
          errors,
          phase,
          rowsRejected,
          rowsUploaded,
          status,
        }: ProcessStatus) => {
          if (
            this.cancel ||
            this.router.url !== internalFullRoutingNames.HOME
          ) {
            stopLoop();
            return;
          }
          const finalStates: string[] = [
            processStatus.rejected,
            processStatus.failed,
            processStatus.completed,
            processStatus.confirmUser,
          ];
          if (finalStates.includes(status)) {
            stopLoop();
            this.componentRef.destroy();
            this.excelService.errores =
              status === processStatus.rejected ? errors : [];
            const closeObj = {
              status,
              rowsAccepted: rowsUploaded,
              rowsRejected: rowsRejected,
            };
            this.onClose.emit(closeObj);
            this.excelService.resetProcessState();
          } else {
            this.componentRef.instance.progress.mode = 'determinate';
            this.componentRef.instance.progress.value = advance;
            if (status == processStatus.validating) {
              this.componentRef.instance.progress.status = `Validando (${phase}/3)`;
            } else if (status == processStatus.saving) {
              this.componentRef.instance.progress.status = `Grabando (${phase}/2)`;
            }
          }
        },
      );
  }
}
