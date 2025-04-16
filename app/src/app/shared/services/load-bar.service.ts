import {
  type ComponentRef,
  Injectable,
  type ViewContainerRef,
} from '@angular/core';

import { LoadBarComponent } from '../components/load-bar/load-bar.component';

@Injectable()
export class LoadBarService {
  private componentRef: ComponentRef<LoadBarComponent> = null;

  public show(container: ViewContainerRef) {
    this.componentRef = container.createComponent(LoadBarComponent);
  }

  public close() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
