import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[csOnlyNumbers]',
})
export class OnlyNumbersDirective {
  constructor(private _el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/\D*/g, '');
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
