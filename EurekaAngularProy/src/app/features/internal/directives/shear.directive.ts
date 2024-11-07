import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[csShear]',
  standalone: true,
})
export class ShearDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(
      /[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ-]*/g,
      '',
    );
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
