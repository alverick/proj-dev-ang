import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, EventEmitter } from "@angular/core";
import { ExcelService } from "../services/excel.service";
import { LoadFileComponent } from "./load-file.component";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { GoogleAnalytics } from "../services/googleAnalytics.service";
import { drawPopup } from "src/app/shared/services/popups";

@Injectable({
  providedIn: 'root'
})
export class LoadFileService {
  constructor (private excelService: ExcelService,
    private resolver: ComponentFactoryResolver,
    private gaService: GoogleAnalytics
    ) { }

  private componentRef: ComponentRef<LoadFileComponent> = null;
  private cancel = true;
  public onClose = new EventEmitter<any>();

  public verify(container: ViewContainerRef) {
    container.clear();
    if (this.excelService.statusUpload) {
      const factory = this.resolver.resolveComponentFactory<LoadFileComponent>(LoadFileComponent);
      this.componentRef = container.createComponent<LoadFileComponent>(factory);
      this.verifyStatus();
    }
    else {
      this.excelService.GetLastProcess()
      .subscribe(d => {
        if (d.status !== 'COMPLETED' && d.status !== 'REJECTED') {
          const factory = this.resolver.resolveComponentFactory<LoadFileComponent>(LoadFileComponent);
          this.componentRef = container.createComponent<LoadFileComponent>(factory);
          this.verifyStatus();
        }
      });
    }
  }

  public close() {
    if (this.componentRef) {
      this.cancel = true;
      this.componentRef.destroy();
    }
  }

  private verifyStatus() {
    this.cancel = false;
    let recursiveFunc = (value) => {
      if (this.cancel) return;
      if (value.status === "REJECTED") {
        this.excelService.errores = value.errors;
        this.componentRef.destroy();
        this.onClose.emit({
          status: 'rejected',
          rowsAccepted: value.rowsUploaded,
          rowsRejected: value.rowsRejected
        });
      }
      else if (value.status === 'COMPLETED') {
        this.gaService.sendEvent('CargarExcel', {
          'event_category': 'CargaExcel',
          'event_label': 'cargar_excel'
        });
        this.excelService.statusUpload = false;
        this.excelService.errores = [];
        this.componentRef.destroy();
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
          onAfterClose: () => { this.onClose.emit({ status: 'completed' }); }
        });
    }
      else {
        this.componentRef.instance.progress.mode = 'determinate';
        this.componentRef.instance.progress.value = value.advance;
        if (value.status == "VALIDATING") {
          this.componentRef.instance.progress.status = `Validando (${value.phase}/3)`;
        }
        else if (value.status == "SAVING") {
          this.componentRef.instance.progress.status = `Grabando (${value.phase}/2)`;
        }
        var th = this;
        setTimeout(() => {
          th.excelService.StatusExcel(th.excelService.idProcess)
            .subscribe(recursiveFunc);
        }, 500);
      }
    };
    this.componentRef.instance.progress.mode = 'determinate';
    this.componentRef.instance.progress.value = 0;
    this.componentRef.instance.progress.status = 'Validando (0/3)';
    setTimeout(() => {
      this.excelService.StatusExcel(this.excelService.idProcess)
      .subscribe(recursiveFunc);
    }, 800);
  }
}
