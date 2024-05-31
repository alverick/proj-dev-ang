import {
  type ConnectionPositionPair,
  type PositionStrategy,
  Overlay,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { PopoverComponent } from './popover.component';
import { type PopoverContent, PopoverRef } from './popover-ref';

export interface PopoverParams<T> {
  width?: string | number;
  height?: string | number;
  origin: HTMLElement;
  content: PopoverContent;
  data?: T;
}

@Injectable({
  providedIn: 'root',
})
export class Popover {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>({
    origin,
    content,
    data,
    width,
    height,
  }: PopoverParams<T>): PopoverRef<T> {
    const overlayRef = this.overlay.create(
      this.getOverlayConfig({ origin, width, height })
    );
    const popoverRef = new PopoverRef<T>(overlayRef, content, data);

    const injector = this.createInjector(popoverRef, this.injector);
    overlayRef.attach(new ComponentPortal(PopoverComponent, null, injector));

    return popoverRef;
  }

  private getOverlayConfig({ origin, width, height }): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: 'popover-backdrop',
      positionStrategy: this.getOverlayPosition(origin),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  private getOverlayPosition(origin: HTMLElement): PositionStrategy {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withFlexibleDimensions(false)
      .withPush(false);

    return positionStrategy;
  }

  createInjector(popoverRef: PopoverRef, injector: Injector) {
    const tokens = new WeakMap([[PopoverRef, popoverRef]]);
    return new PortalInjector(injector, tokens);
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
    ];
  }
}
