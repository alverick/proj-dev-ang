import { NgClass } from '@angular/common';
import { Component, input, type OnInit, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { type ISelectOptions } from '../../constants/company';
import { debtorCodeCustomEmpty, ServiceTypes } from '../../constants/services';
import { InputWithoutSpacesDirective } from '../../directives/input-without-spaces.directive';
import { type ServiceTypeType } from '../../models';
import { IErrorMessages, ModelFormGroup } from '../../models/forms';
import {
  type ServiceConfigurationForm,
  type ServiceDebt,
} from '../../services/services-forms.service';
import { LabelControlComponent } from '../label-control/label-control.component';
import { MessageAlertComponent } from '../message-alert/message-alert.component';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';

@Component({
  selector: 'cs-service-step-configuration',
  templateUrl: './service-step-configuration.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    RadioButtonModule,
    InputTextModule,
    InputWithoutSpacesDirective,
    ButtonDirective,
    Ripple,
    MessageAlertComponent,
    ServiceDebtFormComponent,
    NgClass,
    Select,
  ],
})
export class ServiceStepConfigurationComponent implements OnInit {
  readonly sendForm = output<object>();
  readonly cancel = output();
  readonly form = input<ModelFormGroup<ServiceConfigurationForm>>(undefined);
  readonly errorMessages = input<IErrorMessages>(undefined);
  readonly debtorCodeOptions = input<ISelectOptions[]>(undefined);
  readonly paymentTypeOptions = input<ISelectOptions[]>(undefined);
  readonly currencyOptions = input<ISelectOptions[]>(undefined);
  readonly chargeTypeOptions = input<ISelectOptions[]>(undefined);
  readonly interestTypeOptions = input<ISelectOptions[]>(undefined);
  readonly showCancel = input(false);
  readonly showAllTypes = input(false);
  readonly currency = input('');
  debtForm: ModelFormGroup<ServiceDebt>;
  showDebtFields = false;
  currencySymbol = '';
  debtorCodeEditable = false;
  submittedForm = false;
  $destroy = new Subject();
  protected readonly serviceTypes = ServiceTypes;

  ngOnInit() {
    this.listenForms();
    const form = this.form();
    this.debtForm = form?.get('debt') as ModelFormGroup<ServiceDebt>;
    this.setDebtForm(form?.value.dataType);
    this.setDebtorCodeCustomField(
      form?.value.debtorCode,
      form?.value.debtorCodeCustom,
    );
    this.currencySymbol = this.currencyOptions()?.find(
      (currency) => currency.value === this.currency(),
    )?.symbol;
  }

  listenForms() {
    this.form()
      ?.get('dataType')
      .valueChanges.subscribe((val) => {
        setTimeout(() => {
          this.setDebtForm(val);
        }, 100);
      });
    this.form()
      ?.get('debtorCode')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((val) => {
        this.setDebtorCodeCustomField(val);
      });
  }

  private setDebtorCodeCustomField(debtorVal: string, debtorCustom = '') {
    this.debtorCodeEditable = debtorVal === 'Otro';
    if (debtorVal === 'Otro') {
      this.form()?.get('debtorCodeCustom').setValue(debtorCustom);
    } else {
      this.form()?.get('debtorCodeCustom').setValue(debtorCodeCustomEmpty);
    }
  }

  showDropdown() {
    this.form().get('debtorCode').setValue('');
    this.debtorCodeEditable = false;
  }

  private setDebtForm(val: ServiceTypeType) {
    this.showDebtFields = val === ServiceTypes.complete;
    if (this.showDebtFields) {
      this.debtForm?.enable();
      this.debtForm?.valueChanges.subscribe(() => {
        setTimeout(() => {
          this.form().updateValueAndValidity();
        }, 100);
      });
    } else {
      this.debtForm?.disable();
      this.debtForm?.reset({
        partialPayment: 'S',
        chargeInterest: 'N',
      });
    }
    this.form()?.updateValueAndValidity();
  }

  onSubmit() {
    const { debtorCodeCustom, ...formValue } = this.form().value;
    this.submittedForm = true;
    setTimeout(() => {
      if (this.form().valid) {
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
