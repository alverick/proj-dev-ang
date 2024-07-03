import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appSearch]',
})
export class SearchDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) InputShearNombreCodigo(event) {
    let initalValue = this.el.nativeElement.value;
    initalValue = initalValue.replace(/\s{2,}/g, ' ');
    this.el.nativeElement.value = initalValue.replace(
      /[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g,
      ''
    );
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
