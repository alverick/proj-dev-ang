import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormGroup,
  NgForm,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { pathEq } from 'ramda';
import { IErrorMessages } from '../../models/forms';

@Component({
  selector: 'cs-service-debt-form',
  templateUrl: './service-debt-form.component.html',
  styleUrls: ['./service-debt-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ServiceDebtFormComponent,
      multi: true,
    },
  ],
})
export class ServiceDebtFormComponent
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor
{
  @Input() form: UntypedFormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() submitted = false;
  @ViewChild('formElm')
  htmlForm: NgForm;
  showArrearsFields = false;
  unitAmount = 'S/';
  onTouched: any;

  ngOnInit() {
    const { chargeInterest, interestType } = this.form.value;
    this.processArrearsMode(chargeInterest === 'S');
    this.unitAmount = interestType === 'M' ? 'S/' : '%';
    this.listenForms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (pathEq(['submitted', 'currentValue'], true, changes) && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }

  processArrearsMode(show: boolean) {
    this.showArrearsFields = show;
    ['chargeType', 'interestType', 'amount'].forEach((field) => {
      if (show) {
        this.form.get(field).enable();
      } else {
        this.form.get(field).disable();
      }
    });
  }

  listenForms() {
    this.form.get('chargeInterest').valueChanges.subscribe((val) => {
      this.processArrearsMode(val === 'S');
    });
    this.form.get('interestType').valueChanges.subscribe((val) => {
      this.unitAmount = val === 'M' ? 'S/' : '%';
    });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe((value) => {
      fn(value);
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.form.patchValue(obj, { emitEvent: false });
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.form.disable() : this.form.enable();
  }

  ngAfterViewInit(): void {
    if (this.submitted && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }
}
