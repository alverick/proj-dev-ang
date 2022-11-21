import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { has, isNil } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { throttleTime } from 'rxjs/operators';
import { IErrorMessages } from '../../../../shared/models/forms';
import { debtorCodeCustomEmpty, debtorCodeOptions } from '../../constants';

@Component({
  selector: 'cs-service-edit-form',
  templateUrl: './service-edit-form.component.html',
  styleUrls: ['./service-edit-form.component.scss'],
})
export class ServiceEditFormComponent implements OnInit, OnChanges {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() formData: any;
  debtForm: FormGroup;
  debtorCodeEditable = false;
  submittedForm = false;
  showDebtFields = false;

  ngOnInit() {
    this.debtForm = this.form.get('debt') as FormGroup;
    this.listenForChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (has('formData', changes) && isNotNil(this.formData)) {
      const { dataType, ...debt } = this.formData.debt;
      this.setDebtForm(dataType, debt.chargeInterest);
    }
  }

  showDropdown() {
    this.form.get('debtorCode').setValue('');
    this.debtorCodeEditable = false;
  }

  setFormData() {
    if (isNil(this.formData)) {
      return;
    }
    const { debtorCode } = this.formData;
    const debtorCodeVal = debtorCodeOptions.some(
      ({ value }) => value === debtorCode
    );
    this.debtorCodeEditable = !debtorCodeVal;
    const debtorCodeObj = debtorCodeVal
      ? { debtorCode, debtorCodeCustom: debtorCodeCustomEmpty }
      : { debtorCode: 'Otro', debtorCodeCustom: debtorCode };

    const { dataType, chargeType, ...debt } = this.formData.debt;

    setTimeout(() => {
      this.form.setValue({
        ...this.formData,
        ...debtorCodeObj,
        debt: { ...debt, chargeType: String(chargeType) },
      });
    }, 400);
  }

  listenForChanges() {
    this.debtForm
      .get('chargeType')
      .statusChanges.pipe(throttleTime(1000))
      .subscribe(() => {
        this.setFormData();
      });
    this.form.get('debtorCode').valueChanges.subscribe((val) => {
      this.debtorCodeEditable = val === 'Otro';
      if (val === 'Otro') {
        this.form.get('debtorCodeCustom').setValue('');
      } else {
        this.form.get('debtorCodeCustom').setValue(debtorCodeCustomEmpty);
      }
    });
  }

  private setDebtForm(dataType, chargeInterest) {
    this.showDebtFields = dataType === 'C';
    if ('C' === dataType) {
      this.debtForm.enable();
      this.debtForm.get('chargeInterest').setValue(chargeInterest);
    } else {
      this.setFormData();
      this.debtForm.disable();
    }
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.form.value;
    console.log('-> formValue', formValue, this.form);
    this.submittedForm = true;
    if (this.form.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
