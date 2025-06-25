import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[csInputWithoutSpaces]',
  standalone: true,
})
export class InputWithoutSpacesDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.sanitize(input.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const sanitized = this.sanitize(clipboardData);
    const input = event.target as HTMLInputElement;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const newValue =
      input.value.slice(0, start) + sanitized + input.value.slice(end);
    input.value = newValue;

    input.setSelectionRange(start + sanitized.length, start + sanitized.length);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  private sanitize(value: string): string {
    return value.replace(/\s{2,}/g, ' ').replace(/[^-\dA-Za-z ]*/g, '');
  }
}
