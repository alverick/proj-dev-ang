import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'cs-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.scss'],
})
export class LabelControlComponent
  implements OnInit, AfterViewInit, AfterContentInit, ControlValueAccessor
{
  static labelCounter = 0;
  useDefaultContent = false;
  useGap = false;

  @Input() labelInputID = 'form-label-' + LabelControlComponent.labelCounter;
  @Input() onlyControl = false;
  @Input() formControlName: string;
  @Input() formControlLabel: string;
  @Input() errorMessages: { [key: string]: string };
  @ViewChild('wrapper', { static: false }) wrapper: ElementRef<HTMLDivElement>;

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

  ngOnInit() {}

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

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
