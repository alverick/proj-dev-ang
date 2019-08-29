import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appNameEnterpise]'
})
export class NameEnterpiseDirective {

 
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initalValue = this.el.nativeElement.value;
    initalValue = initalValue.replace(/( ){2}/g, ' ');
    this.el.nativeElement.value = initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-.]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }


}
