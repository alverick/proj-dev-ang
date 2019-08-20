import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appShear]'
})
export class ShearDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) InputShearNombreCodigo(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^ 0-9-a-z-A-Z-´]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
