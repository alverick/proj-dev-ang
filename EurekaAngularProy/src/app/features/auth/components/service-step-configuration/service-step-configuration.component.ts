import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-step-configuration',
  templateUrl: './service-step-configuration.component.html',
  styleUrls: ['./service-step-configuration.component.scss'],
})
export class ServiceStepConfigurationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  debtForm: FormGroup;
  showDebtFields = false;
  debtorCodeEditable = false;
  submittedForm = false;
  $destroy = new Subject();

  constructor() {}

  ngOnInit() {
    this.listenForms();
    this.debtForm = this.form.get('debt') as FormGroup;
    this.setDebtForm(this.form.value.dataType);
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
        console.log('-> val', val);
        this.debtorCodeEditable = val === 'Otro';
        if (val === 'Otro') {
          this.form.get('debtorCode').setValue('');
        }
      });
  }

  private setDebtForm(val) {
    this.showDebtFields = val === 'C';
    if ('C' === val) {
      this.debtForm.enable();
    } else {
      this.debtForm.disable();
      this.debtForm.reset({
        partialPayment: 'S',
        chargeInterest: 'N',
      });
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
