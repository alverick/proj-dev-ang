import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbersForm]',
})
export class OnlyNumbersFormDirective {
  constructor(private _el: ElementRef) {
    console.log('-> _el', _el);
  }

  @HostListener('input', ['$event'])
  onInputKeydow(event) {
    console.log('-> event', event, this);
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9\.]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
