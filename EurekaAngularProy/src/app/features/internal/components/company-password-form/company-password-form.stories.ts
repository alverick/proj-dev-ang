import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action, withActions } from '@storybook/addon-actions';
import { centered } from '@storybook/addon-centered/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import { SharedModule } from '../../../../shared/shared.module';
import { CompanyPasswordFormComponent } from './company-password-form.component';

@Component({
  selector: 'cs-form-demo',
  template: `<cs-company-password-form
    class="tw-max-w-2xl tw-pl-20"
    [form]="registerForm"
    [errorMessages]="errors"
    (sendForm)="onSendForm($event)"
  ></cs-company-password-form> `,
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter();
  registerForm: FormGroup;
  errors = { ...errorRegisterAuth, newPassword: errorRegisterAuth.password };
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      passwordConfirm: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
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
  onSendForm(event) {
    this.sendForm.emit(event);
  }
}

export default {
  title: 'Internal/Module/Company Form Password',
  decorators: [
    withKnobs,
    centered,
    moduleMetadata({
      declarations: [CompanyPasswordFormComponent],
      imports: [BrowserAnimationsModule, SharedModule],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  component: CompanyPasswordFormComponent,
  moduleMetadata: {
    declarations: [FormDemoComponent, CompanyPasswordFormComponent],
    providers: [],
  },
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-form-demo (showPanel)="onSubmit()"></cs-form-demo>`,
  props: {
    onSubmit: action('show panel'),
  },
});
