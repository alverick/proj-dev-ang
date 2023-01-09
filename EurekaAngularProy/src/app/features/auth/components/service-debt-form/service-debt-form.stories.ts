import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { centered } from '@storybook/addon-centered/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { SharedModule } from '../../../../shared/shared.module';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import { AffiliationFormsService } from '../../services';
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
  constructor(affiliationForms: AffiliationFormsService) {
    this.form = affiliationForms.serviceConfigForm.controls.debt as FormGroup;
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
}

const initAppComponentFactory =
  (affiliationForms: AffiliationFormsService) => async () =>
    affiliationForms;

export default {
  title: 'Auth/Module/Service Debt Form',
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
  ],
};

export const normal = () => ({
  component: ServiceDebtFormComponent,
  moduleMetadata: {
    declarations: [FormDemoComponent, ServiceDebtFormComponent],
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
