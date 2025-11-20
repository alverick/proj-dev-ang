import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[csInputMoney]',
  standalone: true,
})
export class InputMoneyDirective {
  private readonly ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    (event.target as HTMLInputElement).value = (
      event.target as HTMLInputElement
    ).value
      .replace(/\.{2,}/g, '.')
      .replace(/[^0-9.]*/g, '');
  }
  @HostListener('blur', ['$event'])
  onBlur() {
    const value = parseFloat(this.ngControl.value as string);

    if (!isNaN(value)) {
      this.ngControl.control.setValue(value.toFixed(2), {
        emitEvent: true,
      });
    }
  }
}
