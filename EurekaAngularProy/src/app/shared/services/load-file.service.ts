import {
  ComponentRef,
  EventEmitter,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';

import { internalFullRoutingNames } from '../../app-routing.collection';
import { LoadFileComponent } from '../components/load-file/load-file.component';
import { ExcelService, ProcessStatus } from './excel.service';
import { StorageService } from './storage.service';

export interface ModalCloseData {
  status: string;
  rowsAccepted: number;
  rowsRejected: number;
  dataType: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadFileService {
  constructor(
    private excelService: ExcelService,
    private storageService: StorageService,
    private router: Router
  ) {}

  private componentRef: ComponentRef<LoadFileComponent> = null;
  private cancel = true;
  public onClose = new EventEmitter<Partial<ModalCloseData>>();

  public verify(container: ViewContainerRef) {
    container.clear();
    if (this.excelService.statusUpload) {
      this.componentRef = container.createComponent(LoadFileComponent);
      this.verifyStatus();
    } else {
      this.excelService.GetLastProcess().subscribe((d) => {
        if (d.status !== 'COMPLETED' && d.status !== 'REJECTED') {
          this.componentRef = container.createComponent(LoadFileComponent);
          this.verifyStatus();
        }
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
          if (status === 'REJECTED') {
            stopLoop();
            this.componentRef.destroy();
            this.excelService.errores = errors;
            this.onClose.emit({
              status: 'rejected',
              rowsAccepted: rowsUploaded,
              rowsRejected: rowsRejected,
            });
          } else if (status === 'FAILED') {
            stopLoop();
            this.componentRef.destroy();
            this.onClose.emit({
              status: 'failed',
            });
          } else if (status === 'COMPLETED') {
            stopLoop();
            this.componentRef.destroy();
            this.excelService.statusUpload = false;
            this.excelService.errores = [];
            this.onClose.emit({
              status: 'completed',
              dataType: this.excelService.service.dataType,
            });
          } else {
            this.componentRef.instance.progress.mode = 'determinate';
            this.componentRef.instance.progress.value = advance;
            if (status == 'VALIDATING') {
              this.componentRef.instance.progress.status = `Validando (${phase}/3)`;
            } else if (status == 'SAVING') {
              this.componentRef.instance.progress.status = `Grabando (${phase}/2)`;
            }
          }
        }
      );
    this.componentRef.instance.progress.mode = 'determinate';
    this.componentRef.instance.progress.value = 0;
    this.componentRef.instance.progress.status = 'Validando (0/3)';
  }
}
