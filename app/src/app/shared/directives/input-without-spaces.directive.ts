import { Directive, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[csInputWithoutSpaces]',
  standalone: true,
})
export class InputWithoutSpacesDirective {
  @Input() csFilter = /[^\dA-Za-z ]*/g;
  constructor(@Self() @Optional() private readonly ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitized = this.sanitize(input.value);
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(sanitized, { emitEvent: true });
    } else {
      input.value = sanitized;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const clipboard = event.clipboardData?.getData('text') ?? '';
    const sanitizedPaste = this.sanitize(clipboard);

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const before = input.value.slice(0, start);
    const after = input.value.slice(end);

    const maxLength = input.maxLength > 0 ? input.maxLength : Infinity;
    const available = maxLength - (before.length + after.length);
    const insert = sanitizedPaste.slice(0, available);

    const newValue = before + insert + after;

    if (this.ngControl?.control) {
      this.ngControl.control.setValue(newValue, { emitEvent: true });
    } else {
      input.value = newValue;
      input.setSelectionRange(start + insert.length, start + insert.length);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.trim();
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(trimmed, { emitEvent: true });
    } else {
      input.value = trimmed;
    }
  }

  private sanitize(value: string): string {
    return value
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .replace(this.csFilter, ''); // Remove disallowed characters
  }
}
