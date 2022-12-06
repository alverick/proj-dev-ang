import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[csInputWithoutSpaces]',
})
export class InputWithoutSpacesDirective {
  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.target.value = event.target.value
      .replace(/\s{2,}/g, ' ')
      .replace(/[^ 0-9-A-Z-a-z]*/g, '');
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    event.target.value = event.target.value.trim();
  }
}
