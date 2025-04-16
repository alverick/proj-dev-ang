import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[csInputWithoutSpaces]',
  standalone: true,
})
export class InputWithoutSpacesDirective {
  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.target.value = event.target.value
      .replace(/\s{2,}/g, ' ')
      .replace(/[^- \dA-Za-z]*/g, '');
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    event.target.value = event.target.value.trim();
  }
}
