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
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { SharedModule } from '../../../../shared/shared.module';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorMessagesServiceConfig,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../constants';
import {
  InputMoneyDirective,
  InputWithoutSpacesDirective,
} from '../../directives';
import { AffiliationFormsService } from '../../services';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

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
  errors = errorMessagesServiceConfig;
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  constructor(affiliationForms: AffiliationFormsService) {
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
  component: ServiceStepConfigurationComponent,
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
  component: ServiceStepConfigurationComponent,
  moduleMetadata: {
    declarations: [
      FormDemoComponent,
      ServiceStepConfigurationComponent,
      ServiceDebtFormComponent,
      InputWithoutSpacesDirective,
      InputMoneyDirective,
    ],
    providers: [],
  },
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-form-demo [showCancel]="edit" (sendForm)="onSubmit($event)" (cancel)="onCancel()"></cs-form-demo>`,
  props: {
    edit: boolean('Show Cancel', false),
    onCancel: action('form cancel'),
    onSubmit: (e) => {
      console.log(e);
      action('form data')(e);
    },
  },
});
