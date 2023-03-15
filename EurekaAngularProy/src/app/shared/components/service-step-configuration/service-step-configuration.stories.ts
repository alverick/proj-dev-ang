import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { centered } from '@storybook/addon-centered/angular';
import { moduleMetadata } from '@storybook/angular';

import { AffiliationFormsService } from '../../../features/auth/services';
import { errorServiceConfiguration } from '../../constants/company-errors';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants/services';
import { IDataEnterpriseModel } from '../../models/data-enterprise.model';
import { ServicesFormsService } from '../../services';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'cs-form-demo',
  template: `<cs-service-step-configuration
    [form]="form"
    [errorMessages]="errors"
    [debtorCodeOptions]="debtorCodeOptions"
    [paymentTypeOptions]="paymentTypeOptions"
    [currencyOptions]="currencyOptions"
    [chargeTypeOptions]="chargeTypeOptions"
    [interestTypeOptions]="interestTypeOptions"
    [showCancel]="showCancel"
    (cancel)="onCancel()"
    (sendForm)="onSubmit($event)"
  ></cs-service-step-configuration>`,
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  @Output() cancel = new EventEmitter();
  @Input() showCancel = false;
  form: FormGroup;
  errors = errorServiceConfiguration;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  constructor(affiliationForms: ServicesFormsService) {
    this.form = affiliationForms.serviceConfigForm;
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
  onCancel() {
    this.cancel.emit();
  }
}

const initAppComponentFactory =
  (affiliationForms: AffiliationFormsService) => async () =>
    affiliationForms;

export default {
  title: 'Auth/Module/Service Form Configuration',
  decorators: [
    centered,
    moduleMetadata({
      imports: [BrowserAnimationsModule, SharedModule],
      providers: [
        AffiliationFormsService,
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [AffiliationFormsService],
        },
      ],
    }),
  ],
};

export const normal = () => ({
  moduleMetadata: {
    declarations: [FormDemoComponent],
    providers: [],
  },
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-form-demo [showCancel]="edit" (sendForm)="onSubmit($event)" (cancel)="onCancel()"></cs-form-demo>`,
  props: {
    edit: false,
    onCancel: action('form cancel'),
    onSubmit: (e) => {
      console.log(e);
      action('form data')(e);
    },
  },
});
