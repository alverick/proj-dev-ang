import {
  type OnInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { type ISelectOptions } from '../../constants/company';
import { debtorCodeCustomEmpty } from '../../constants/services';
import { IErrorMessages, ModelFormGroup } from '../../models/forms';
import {
  type ServiceConfigurationForm,
  type ServiceDebt,
  type ServiceTypeType,
  ServiceTypes,
} from '../../services/services-forms.service';

@Component({
  selector: 'cs-service-step-configuration',
  templateUrl: './service-step-configuration.component.html',
  styleUrls: ['./service-step-configuration.component.scss'],
})
export class ServiceStepConfigurationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  @Input() form: ModelFormGroup<ServiceConfigurationForm>;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: ISelectOptions[];
  @Input() paymentTypeOptions: ISelectOptions[];
  @Input() currencyOptions: ISelectOptions[];
  @Input() chargeTypeOptions: ISelectOptions[];
  @Input() interestTypeOptions: ISelectOptions[];
  @Input() showCancel = false;
  @Input() showAllTypes = true;
  debtForm: ModelFormGroup<ServiceDebt>;
  showDebtFields = false;
  debtorCodeEditable = false;
  submittedForm = false;
  $destroy = new Subject();
  protected readonly serviceTypes = ServiceTypes;

  ngOnInit() {
    this.listenForms();
    this.debtForm = this.form?.get('debt') as ModelFormGroup<ServiceDebt>;
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

  private setDebtorCodeCustomField(debtorVal: string, debtorCustom = '') {
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

  private setDebtForm(val: ServiceTypeType) {
    this.showDebtFields = val === ServiceTypes.complete;
    if (this.showDebtFields) {
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
    setTimeout(() => {
      if (this.form.valid) {
        this.sendForm.emit({
          ...formValue,
          debtorCode:
            debtorCodeCustom === debtorCodeCustomEmpty
              ? formValue.debtorCode
              : debtorCodeCustom,
        });
      }
    }, 200);
  }

  onCancel() {
    this.cancel.emit();
  }
}
