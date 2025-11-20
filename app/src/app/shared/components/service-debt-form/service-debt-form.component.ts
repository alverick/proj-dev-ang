import { CurrencyPipe } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  Input,
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  type ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { pathEq } from 'ramda';

import { ISelectOptions } from '../../constants/company';
import { InputMoneyDirective } from '../../directives/input-money.directive';
import { IErrorMessages, ModelFormGroup } from '../../models/forms';
import { type ServiceDebt } from '../../services/services-forms.service';
import { LabelControlComponent } from '../label-control/label-control.component';

@Component({
  selector: 'cs-service-debt-form',
  templateUrl: './service-debt-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ServiceDebtFormComponent,
      multi: true,
    },
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    RadioButtonModule,
    InputNumberModule,
    InputMoneyDirective,
    CurrencyPipe,
    Select,
  ],
})
export class ServiceDebtFormComponent
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor
{
  @Input() form: ModelFormGroup<ServiceDebt>;
  @Input() errorMessages: IErrorMessages;
  @Input() paymentTypeOptions: ISelectOptions[];
  @Input() currencyOptions: ISelectOptions[];
  @Input() chargeTypeOptions: ISelectOptions[];
  @Input() interestTypeOptions: ISelectOptions[];
  @Input() submitted = false;
  @Input() interestOnlyInfo = false;
  @Input() currency = 'S/';
  @ViewChild('formElm')
  htmlForm: NgForm;
  showArrearsFields = false;
  unitAmount = 'S/ ';
  maxAmount = 1000;
  minAmount = 0.01;
  onTouched: () => void = () => {};

  ngOnInit() {
    const { chargeInterest, interestType } = this.form.value;
    this.processArrearsMode(chargeInterest === 'S');
    this.setAmountProps(interestType);
    this.listenForms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (pathEq(true, ['submitted', 'currentValue'], changes) && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }

  processArrearsMode(show: boolean) {
    this.showArrearsFields = show;
    if (show) {
      this.enableFields(['chargeType', 'interestType', 'amount']);
    } else {
      this.disableFields(['chargeType', 'interestType', 'amount']);
    }
  }

  enableFields(fields: string[]) {
    fields.forEach((field) => this.form.get(field)?.enable());
  }

  disableFields(fields: string[]) {
    fields.forEach((field) => this.form.get(field)?.disable());
  }

  setAmountProps(val) {
    this.unitAmount = val === 'M' ? this.currency : '% ';
    this.maxAmount = val === 'M' ? 1000 : 100;
    this.minAmount = val === 'M' ? 0.5 : 0.01;
  }

  listenForms() {
    this.form.get('chargeInterest').valueChanges.subscribe((val) => {
      this.processArrearsMode(val === 'S');
    });
    this.form.get('interestType').valueChanges.subscribe((val) => {
      this.setAmountProps(val);
    });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.form.valueChanges.subscribe((value) => {
      fn(value);
    });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: Partial<ServiceDebt>): void {
    this.form.patchValue(obj, { emitEvent: false });
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.disableFields(Object.keys(this.form.controls));
    } else {
      this.enableFields(Object.keys(this.form.controls));
    }
  }

  ngAfterViewInit(): void {
    if (this.submitted && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }
}
