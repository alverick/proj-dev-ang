import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

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
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-service-step-configuration
    [form]="form"
    [errorMessages]="errors"
    [debtorCodeOptions]="debtorCodeOptions"
    [paymentTypeOptions]="paymentTypeOptions"
    [currencyOptions]="currencyOptions"
    [chargeTypeOptions]="chargeTypeOptions"
    [interestTypeOptions]="interestTypeOptions"
    [showCancel]="showCancel"
    [showAllTypes]="showAllTypes"
    (cancel)="onCancel()"
    (sendForm)="onSubmit($event)"
  ></cs-service-step-configuration>`,
  standalone: true,
  imports: [ServiceStepConfigurationComponent],
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  @Output() cancel = new EventEmitter();
  @Input() showCancel = false;
  @Input() showAllTypes = false;
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

const meta: Meta<FormDemoComponent> = {
  title: 'Auth/Module/Service Form Configuration',
  component: FormDemoComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      declarations: [],
      imports: [ValidationDefaultsComponent],
      providers: [
        ServicesFormsService,
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

export default meta;

type Story = StoryObj<FormDemoComponent>;

export const Normal: Story = {
  args: {
    showAllTypes: false,
  },
};
export const ShowAll: Story = {
  args: {
    showAllTypes: true,
  },
};
