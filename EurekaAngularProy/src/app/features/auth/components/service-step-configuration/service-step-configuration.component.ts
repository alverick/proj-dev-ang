import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IErrorMessages } from '../../../../shared/models/forms';
import { debtorCodeCustomEmpty } from '../../constants';

@Component({
  selector: 'cs-service-step-configuration',
  templateUrl: './service-step-configuration.component.html',
  styleUrls: ['./service-step-configuration.component.scss'],
})
export class ServiceStepConfigurationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  @Input() form: UntypedFormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() showCancel = false;
  debtForm: UntypedFormGroup;
  showDebtFields = false;
  debtorCodeEditable = false;
  submittedForm = false;
  $destroy = new Subject();

  constructor() {}

  ngOnInit() {
    this.listenForms();
    this.debtForm = this.form.get('debt') as UntypedFormGroup;
    this.setDebtForm(this.form.value.dataType);
    this.setDebtorCodeCustomField(
      this.form.value.debtorCode,
      this.form.value.debtorCodeCustom
    );
  }

  listenForms() {
    this.form.get('dataType').valueChanges.subscribe((val) => {
      setTimeout(() => {
        this.setDebtForm(val);
      }, 100);
    });
    this.form
      .get('debtorCode')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((val) => {
        this.setDebtorCodeCustomField(val);
      });
  }

  private setDebtorCodeCustomField(debtorVal, debtorCustom = '') {
    this.debtorCodeEditable = debtorVal === 'Otro';
    if (debtorVal === 'Otro') {
      this.form.get('debtorCodeCustom').setValue(debtorCustom);
    } else {
      this.form.get('debtorCodeCustom').setValue(debtorCodeCustomEmpty);
    }
  }

  showDropdown() {
    this.form.get('debtorCode').setValue('');
    this.debtorCodeEditable = false;
  }

  private setDebtForm(val) {
    this.showDebtFields = val === 'C';
    if ('C' === val) {
      this.debtForm.enable();
      this.debtForm.valueChanges.subscribe(() => {
        setTimeout(() => {
          this.form.updateValueAndValidity();
        }, 100);
      });
    } else {
      this.debtForm.disable();
      this.debtForm.reset({
        partialPayment: 'S',
        chargeInterest: 'N',
      });
    }
    this.form.updateValueAndValidity();
  }

  onSubmit() {
    const { debtorCodeCustom, ...formValue } = this.form.value;
    this.submittedForm = true;
    if (this.form.valid) {
      this.sendForm.emit({
        ...formValue,
        debtorCode:
          debtorCodeCustom === debtorCodeCustomEmpty
            ? formValue.debtorCode
            : debtorCodeCustom,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
