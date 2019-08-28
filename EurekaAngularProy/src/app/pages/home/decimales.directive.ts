import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimales]'
})
export class DecimalesDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('change', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    let validValue = /^[0-9]{0,4}\.[0-9]{0-2}$/.exec(initalValue);
    console.log(validValue);
    this._el.nativeElement.value = validValue[0];
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
