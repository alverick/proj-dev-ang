import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[csInputTrimSpaces]',
})
export class InputTrimSpacesDirective {
  constructor(private ngControl: NgControl) {}
  @HostListener('input', ['$event'])
  @HostListener('blur', ['$event'])
  onBlur() {
    const value: string = this.ngControl.value;
    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      this.ngControl.control.setValue(value.trim(), {
        emitEvent: false,
      });
    }
  }
}
