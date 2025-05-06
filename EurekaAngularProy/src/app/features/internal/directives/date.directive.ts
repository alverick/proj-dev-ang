import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[csDate]',
  standalone: true,
})
export class DateDirective {
  constructor(private readonly _el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^0-9-/]*/g, '');
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
