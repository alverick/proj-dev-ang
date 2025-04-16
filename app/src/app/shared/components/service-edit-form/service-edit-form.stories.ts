import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { type FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  errorServiceConfiguration,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../features/auth/constants';
import { AffiliationFormsService } from '../../../features/auth/services';
import { type IDataEnterpriseModel } from '../../models/data-enterprise.model';
import { ServicesFormsService } from '../../services';
import { SharedModule } from '../../shared.module';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';

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
    [interestOnlyInfo]="true"
    [formData]="formData"
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
  formData = {
    id: 1639,
    res: '2000302',
    name: 'PAGO3',
    debtorCode: 'DNI',
    idAccount: '',
    accountNumber: '',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: true,
    percentage: null,
    currencySymbol: 'S/',
    inReview: true,
    newNameCode: 'DNI',
    newNameCodeGTPStatus: 3,
    newName: 'nombre invalido',
    newNameGTPStatus: 3,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
    debtorCodeCustom: '',
    nameOriginal: 'PAGO3',
    debtorCodeOriginal: 'DNI',
    debt: {
      dataType: 'C',
      paymentType: 'C',
      chargeInterest: 'S',
      chargeType: 1,
      interestType: 'M',
      amount: 2,
      partialPayment: 'N',
    },
  };
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

const meta: Meta<FormDemoComponent> = {
  title: 'Auth/Module/Service Edit Form',
  decorators: [
    moduleMetadata({
      declarations: [FormDemoComponent],
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        ValidationDefaultsComponent,
      ],
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

export default meta;

type Story = StoryObj<FormDemoComponent>;

export const Normal: Story = {
  render: ({ ...args }) => ({
    props: args,
    template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-form-demo (sendForm)="onSubmit($event)"></cs-form-demo>`,
  }),
};
