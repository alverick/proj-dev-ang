import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[csInputMoney]',
})
export class InputMoneyDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.target.value = event.target.value
      .replace(/\.{2,}/g, '.')
      .replace(/[^0-9.]*/g, '');
  }
  @HostListener('blur', ['$event'])
  onBlur() {
    const value = parseFloat(this.ngControl.value);

    if (!isNaN(value)) {
      this.ngControl.control.setValue(value.toFixed(2), {
        emitEvent: false,
      });
    }
  }
}
