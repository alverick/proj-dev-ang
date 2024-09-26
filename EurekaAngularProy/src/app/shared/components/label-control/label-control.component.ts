import {
  type AfterContentInit,
  type AfterViewInit,
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { type ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'cs-label-control',
  templateUrl: './label-control.component.html',
})
export class LabelControlComponent
  implements AfterViewInit, AfterContentInit, ControlValueAccessor {
  private static labelCounter = 0;
  useDefaultContent = false;
  useGap = false;

  @Input() hideLabel = false;
  @Input() labelInputID = `form-label-${LabelControlComponent.labelCounter}`;
  @Input() onlyControl = false;
  @Input() formControlName: string;
  @Input() formControlLabel: string;
  @Input() errorMessages: Record<string, string>;
  @ViewChild('wrapper') wrapper: ElementRef<HTMLDivElement>;

  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl,
    private elRef: ElementRef<HTMLElement>
  ) {
    if (ngControl != null) {
      ngControl.valueAccessor = this;
    }
    LabelControlComponent.labelCounter++;
  }

  ngAfterViewInit() {
    if (this.wrapper) {
      const inputElement =
        this.wrapper.nativeElement.querySelector('input,textarea');
      if (inputElement) {
        inputElement.setAttribute('id', this.labelInputID);
      }
      setTimeout(() => {
        const nav = this.elRef.nativeElement.querySelector(
          '[validation-messages]'
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
