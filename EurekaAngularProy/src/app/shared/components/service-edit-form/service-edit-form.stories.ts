import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action, withActions } from '@storybook/addon-actions';
import { centered } from '@storybook/addon-centered/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../features/auth/constants';
import { AffiliationFormsService } from '../../../features/auth/services';
import { IDataEnterpriseModel } from '../../models/data-enterprise.model';
import { ServicesFormsService } from '../../services';
import { SharedModule } from '../../shared.module';
import { ServiceEditFormComponent } from './service-edit-form.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-service-edit-form
    [form]="form"
    [errorMessages]="errors"
    [debtorCodeOptions]="debtorCodeOptions"
    [paymentTypeOptions]="paymentTypeOptions"
    [currencyOptions]="currencyOptions"
    [chargeTypeOptions]="chargeTypeOptions"
    [interestTypeOptions]="interestTypeOptions"
    (sendForm)="onSubmit($event)"
  ></cs-service-edit-form>`,
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  form: FormGroup;
  errors = errorServiceConfiguration;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  constructor(servicesForms: ServicesFormsService) {
    this.form = servicesForms.editServiceForm;
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
}

const initAppComponentFactory =
  (affiliationForms: AffiliationFormsService) => async () =>
    affiliationForms;

export default {
  title: 'Auth/Module/Service Edit Form',
  decorators: [
    centered,
    withKnobs,
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
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  component: ServiceEditFormComponent,
  moduleMetadata: {
    declarations: [FormDemoComponent],
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
