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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { pathEq } from 'ramda';

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
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    InputMoneyDirective,
    CurrencyPipe,
  ],
})
export class ServiceDebtFormComponent
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor
{
  @Input() form: ModelFormGroup<ServiceDebt>;
  @Input() errorMessages: IErrorMessages;
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() submitted = false;
  @Input() interestOnlyInfo = false;
  @Input() currency = 'S/';
  @ViewChild('formElm')
  htmlForm: NgForm;
  showArrearsFields = false;
  unitAmount = 'S/ ';
  maxAmount = 1000;
  onTouched: any;

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
    ['chargeType', 'interestType', 'amount'].forEach((field) => {
      if (show) {
        this.form.get(field).enable();
      } else {
        this.form.get(field).disable();
      }
    });
  }

  setAmountProps(val) {
    this.unitAmount = val === 'M' ? this.currency : '% ';
    this.maxAmount = val === 'M' ? 1000 : 100;
  }

  listenForms() {
    this.form.get('chargeInterest').valueChanges.subscribe((val) => {
      this.processArrearsMode(val === 'S');
    });
    this.form.get('interestType').valueChanges.subscribe((val) => {
      this.setAmountProps(val);
    });
  }

  registerOnChange(fn): void {
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
