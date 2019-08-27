import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appCorreo]'
})
export class CorreoDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) InputShearNombreCodigo(event) {
    let initalValue = this.el.nativeElement.value; 
    this.el.nativeElement.value = initalValue.replace(/[^.-@-_0-9-A-Z-a-z]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
