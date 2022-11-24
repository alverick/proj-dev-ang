import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[csInputMoney]',
})
export class InputMoneyDirective {
  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.target.value = event.target.value
      .replace(/\.{2,}/g, '.')
      .replace(/[^0-9.]*/g, '');
  }
  @HostListener('blur', ['$event'])
  onBlur(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      event.target.value = value.toFixed(2);
    }
  }
}
