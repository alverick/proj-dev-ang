import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { Subject } from 'rxjs';

export type PopoverCloseEvent<T = any> = {
  type: 'backdropClick' | 'close';
  data: T;
};

export type StatusChangeEvent = {
  data: string;
};

export type PopoverContent = TemplateRef<any> | Type<any> | string;

export class PopoverRef<T = any> {
  private afterClosed = new Subject<PopoverCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();
  private statusChange = new Subject<StatusChangeEvent>();
  statusChange$ = this.statusChange.asObservable();

  constructor(
    public overlay: OverlayRef,
    public content: PopoverContent,
    public data: T
  ) {
    overlay.backdropClick().subscribe(() => {
      this._close('backdropClick', null);
    });
  }

  close(data?: T) {
    this._close('close', data);
  }

  changeStatus(status: string) {
    this.statusChange.next({
      data: status,
    });
  }

  private _close(type: PopoverCloseEvent['type'], data?: T) {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data,
    });
    this.afterClosed.complete();
  }
}
