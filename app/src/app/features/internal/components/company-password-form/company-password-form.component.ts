import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

import { ControlRulesPoliciesComponent } from '../../../../shared/components/control-rules-policies/control-rules-policies.component';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { CompanyChangePasswordForm } from '../../../../shared/models/company-forms';
import {
  IErrorMessages,
  ModelFormGroup,
} from '../../../../shared/models/forms';
import { messageErrorNewPasswords } from '../../../../shared/validators/password-validators';

@Component({
  selector: 'cs-company-password-form',
  templateUrl: './company-password-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    PasswordModule,
    PrimeTemplate,
    ControlRulesPoliciesComponent,
  ],
})
export class CompanyPasswordFormComponent {
  readonly form = input<ModelFormGroup<CompanyChangePasswordForm>>(undefined);
  readonly errorMessages = input<IErrorMessages>(undefined);
  readonly sendForm = output<Partial<CompanyChangePasswordForm>>();

  protected readonly messageErrorNewPasswords = messageErrorNewPasswords;

  onSubmit() {
    const form = this.form();
    if (form.valid) {
      this.sendForm.emit(form.value);
    }
  }
}
