import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[csInputTrimSpaces]',
  standalone: true,
})
export class InputTrimSpacesDirective {
  constructor(private readonly ngControl: NgControl) {}
  @HostListener('input', ['$event'])
  @HostListener('blur', ['$event'])
  onBlur() {
    const value = this.ngControl.value as string;
    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      this.ngControl.control.setValue(value.trim(), {
        emitEvent: false,
      });
    }
  }
}
