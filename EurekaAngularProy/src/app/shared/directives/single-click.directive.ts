import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[csSingleClick]',
  standalone: true,
})
export class SingleClickDirective implements OnInit, OnDestroy {
  elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private subscription: Subscription;
  throttleMillis = input<number>(5000);
  singleClick = output();

  ngOnInit() {
    this.subscription = fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(throttleTime(this.throttleMillis()))
      .subscribe(() => {
        this.singleClick.emit();
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
