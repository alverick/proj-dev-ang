import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appEmail]'
})
export class EmailDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) InputShearNombreCodigo(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^.-@-_0-9-A-Z-a-z]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
