import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[csOnlyNumbersForm]',
})
export class OnlyNumbersFormDirective {
  constructor(private _el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputKeydown(event: InputEvent) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^\d.]*/g, '');
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
