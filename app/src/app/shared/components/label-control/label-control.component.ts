import { KeyValuePipe, NgClass } from '@angular/common';
import {
  type AfterContentInit,
  type AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NgControl } from '@angular/forms';
import {
  ValidationErrorDirective,
  ValidationErrorsComponent,
} from 'ngx-valdemort';

@Component({
  selector: 'cs-label-control',
  templateUrl: './label-control.component.html',
  imports: [
    NgClass,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    KeyValuePipe,
  ],
})
export class LabelControlComponent
  implements AfterViewInit, AfterContentInit, ControlValueAccessor
{
  ngControl = inject(NgControl, { optional: true, self: true });
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private static labelCounter = 0;
  useDefaultContent = false;
  useGap = false;

  readonly hideLabel = input(false);
  readonly labelInputID = input(
    `form-label-${LabelControlComponent.labelCounter}`,
  );
  readonly onlyControl = input(false);
  readonly formControlName = input<string>(undefined);
  readonly formControlLabel = input<string>(undefined);
  readonly errorMessages = input<Record<string, string>>(undefined);
  readonly wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  constructor() {
    const ngControl = this.ngControl;

    if (ngControl != null) {
      ngControl.valueAccessor = this;
    }
    LabelControlComponent.labelCounter++;
  }

  ngAfterViewInit() {
    const wrapper = this.wrapper();
    if (wrapper) {
      const inputElement =
        wrapper.nativeElement.querySelector('input,textarea');
      if (inputElement) {
        inputElement.setAttribute('id', this.labelInputID());
      }
      setTimeout(() => {
        const nav = this.elRef.nativeElement.querySelector(
          '[validation-messages]',
        );
        this.useDefaultContent = nav === null;
      });
    }
  }

  ngAfterContentInit() {
    const labelInline = this.elRef.nativeElement.querySelector('.label-right');
    this.useGap = labelInline.hasChildNodes();
  }

  registerOnChange(): void {
    //evaluate
  }

  registerOnTouched(): void {
    //evaluate
  }

  writeValue(): void {
    //evaluate
  }
}
