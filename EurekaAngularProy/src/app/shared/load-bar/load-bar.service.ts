import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, EventEmitter } from "@angular/core";
import { ExcelService } from "../services/excel.service";
import { LoadBarComponent } from "./load-bar.component";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { GoogleAnalytics } from "../services/googleAnalytics.service";
import { drawPopup } from "src/app/shared/services/popups";

@Injectable({
  providedIn: 'root'
})
export class LoadBarService {
  constructor (private resolver: ComponentFactoryResolver) { }

  private componentRef: ComponentRef<LoadBarComponent> = null;
  public onClose = new EventEmitter<any>();

  public show(container: ViewContainerRef) {
    const factory = this.resolver.resolveComponentFactory<LoadBarComponent>(LoadBarComponent);
    this.componentRef = container.createComponent<LoadBarComponent>(factory);
  }

  public close() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
