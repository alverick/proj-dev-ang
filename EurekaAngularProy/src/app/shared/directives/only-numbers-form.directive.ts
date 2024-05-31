import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[csOnlyNumbersForm]',
})
export class OnlyNumbersFormDirective {
  constructor(private _el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputKeydow(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9.]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
