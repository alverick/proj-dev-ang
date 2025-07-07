import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { type UntypedFormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';

import { errorServiceConfiguration } from '../../constants/company-errors';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants/services';
import { type IDataEnterpriseModel } from '../../models/data-enterprise.model';
import { ServicesFormsService } from '../../services';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ServiceDebtFormComponent } from './service-debt-form.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-service-debt-form
    [form]="form"
    [errorMessages]="errors"
    [paymentTypeOptions]="paymentTypeOptions"
    [currencyOptions]="currencyOptions"
    [chargeTypeOptions]="chargeTypeOptions"
    [interestTypeOptions]="interestTypeOptions"
  ></cs-service-debt-form>`,
  standalone: true,
  imports: [ServiceDebtFormComponent],
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  form: UntypedFormGroup;
  errors = errorServiceConfiguration;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  constructor(servicesForms: ServicesFormsService) {
    this.form = servicesForms.serviceConfigForm.controls
      .debt as UntypedFormGroup;
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
}

const initAppComponentFactory =
  (servicesForms: ServicesFormsService) => async () =>
    servicesForms;

export default {
  title: 'Auth/Module/Service Debt Form',
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        FormDemoComponent,
        ValidationDefaultsComponent,
      ],
      providers: [
        ServicesFormsService,
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [ServicesFormsService],
        },
      ],
    }),
  ],
};

export const normal = () => ({
  moduleMetadata: {
    providers: [],
  },
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-form-demo (sendForm)="onSubmit($event)"></cs-form-demo>`,
  props: {
    onSubmit: (e) => {
      console.log(e);
      action('form data')(e);
    },
  },
});
