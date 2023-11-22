import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import {
  documentTypes,
  ISelectOptions,
  mobileOperators,
} from '../../../../shared/constants/company';
import { errorsRegisterForm } from '../../../../shared/constants/company-errors';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../../shared/models/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AffiliationFormsService } from '../../services';
import { CompanyFormRegistrationComponent } from './company-form-registration.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-company-form-registration
    class="tw-max-w-2xl tw-pl-20"
    [registerForm]="registerForm"
    [errorMessages]="errorMessages"
    [operators]="operators"
    [documentTypes]="documentTypes"
    (sendForm)="onSubmit($event)"
  ></cs-company-form-registration>`,
})
class FormDemoComponent {
  @Input() operators: ISelectOptions[] = [];
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  registerForm: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() documentTypes: ISelectOptions[] = [];
  constructor(affiliationForms: AffiliationFormsService) {
    this.registerForm = affiliationForms.registerForm;
    this.registerForm.setValue({
      documentType: 'DNI',
      documentNumber: '93883333',
      ruc: '20413425183',
      email: 'sdfs@fsf.com',
      emailConfirm: 'sdfs@fsf.com',
      movilNumber: '982222222',
      movilOperator: 'M',
    });
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
}

const meta: Meta<FormDemoComponent> = {
  title: 'Auth/Module/Company Form Registration',
  component: FormDemoComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      declarations: [FormDemoComponent, CompanyFormRegistrationComponent],
      imports: [SharedModule],
      providers: [AffiliationFormsService],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormDemoComponent>;

export const Normal: Story = {
  args: {
    operators: mobileOperators,
    errorMessages: errorsRegisterForm,
    documentTypes: documentTypes,
  },
};
