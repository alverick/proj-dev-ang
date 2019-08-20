import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appShear]'
})
export class ShearDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) InputShearNombreCodigo(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^Á-É-Í-Ó-Ú 0-9-a-z-A-Z-á-é-í-ó-ú-]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
