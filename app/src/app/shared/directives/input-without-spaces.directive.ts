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
    const input = event.target as HTMLInputElement;
    const clipboardData = event.clipboardData?.getData('text') || '';
    const sanitizedPaste = this.sanitize(clipboardData);

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    const maxLength = input.maxLength > 0 ? input.maxLength : Infinity;

    const availableSpace = maxLength - before.length - after.length;
    const truncatedPaste = sanitizedPaste.slice(0, availableSpace);

    const newValue = before + truncatedPaste + after;
    input.value = newValue;

    const cursorPosition = start + truncatedPaste.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
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
