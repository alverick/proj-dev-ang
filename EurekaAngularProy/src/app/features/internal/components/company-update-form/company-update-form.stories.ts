import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  documentTypes,
  mobileOperators,
} from '../../../../shared/constants/company';
import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import { emailRegex } from '../../../../shared/constants/patterns';
import { SharedModule } from '../../../../shared/shared.module';
import { CompanyUpdateFormComponent } from './company-update-form.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-company-update-form
      class="tw-max-w-2xl tw-pl-20"
      [form]="registerForm"
      [errorMessages]="errors"
      [operators]="operators"
      [documentTypes]="documentTypes"
      [submitted]="submitted"
      (showPanel)="onShowPanel()"
    ></cs-company-update-form>
    {{ submitted }}
    <button (click)="submitted = true" class="tw-block tw-m-3">
      send form
    </button>`,
  standalone: true,
})
class FormDemoComponent {
  @Output() showPanel = new EventEmitter();
  registerForm: FormGroup;
  errors = { ...errorsRegisterForm, ...errorRegisterAuth };
  operators = mobileOperators;
  documentTypes = documentTypes;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      ruc: [{ value: '', disabled: true }],
      entry: [{ value: '', disabled: true }],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(emailRegex),
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      movilOperator: ['', [Validators.required]],
      movilNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
    });
    this.registerForm.patchValue({
      ruc: '20000000005',
      name: 'demo 5',
      entry: '01',
      email: 'mnieva@gmail.com',
      movilNumber: '123456',
      movilOperator: 'C',
      documentType: 'DNI',
      documentNumber: '28235624',
      newName: null,
      newNameGTPStatus: 1,
      status: 'Pendiente',
      inReview: true,
      requestDate: '2019-12-16T23:03:16.675169',
    });
  }
  onShowPanel() {
    this.showPanel.emit();
  }
}
const meta: Meta<CompanyUpdateFormComponent> = {
  title: 'Internal/Module/Company Form',
  decorators: [
    moduleMetadata({
      declarations: [CompanyUpdateFormComponent],
      imports: [FormDemoComponent, BrowserAnimationsModule, SharedModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<CompanyUpdateFormComponent>;

export const Normal: Story = {
  args: {},
  render: ({ ...args }) => ({
    props: args,
    template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-form-demo (showPanel)="onSubmit()"></cs-form-demo>`,
  }),
};
