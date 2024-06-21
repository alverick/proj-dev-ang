import {
  type ComponentRef,
  type ViewContainerRef,
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';

import { LoadBarComponent } from '../components/load-bar/load-bar.component';

@Injectable({
  providedIn: 'root',
})
export class LoadBarService {
  constructor(private resolver: ComponentFactoryResolver) {}

  private componentRef: ComponentRef<LoadBarComponent> = null;

  public show(container: ViewContainerRef) {
    const factory =
      this.resolver.resolveComponentFactory<LoadBarComponent>(LoadBarComponent);
    this.componentRef = container.createComponent<LoadBarComponent>(factory);
  }

  public close() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
