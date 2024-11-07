import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

import { ControlRulesPoliciesComponent } from '../../../../shared/components/control-rules-policies/control-rules-policies.component';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import {
  IErrorMessages,
  ModelFormGroup,
} from '../../../../shared/models/forms';
import { messageErrorNewPasswords } from '../../../../shared/validators/password-validators';
import { type ChangePasswordForm } from '../../services/company-configuration.service';

@Component({
  selector: 'cs-company-password-form',
  templateUrl: './company-password-form.component.html',
  standalone: true,
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
  @Input() form: ModelFormGroup<ChangePasswordForm>;
  @Input() errorMessages: IErrorMessages;
  @Output() sendForm = new EventEmitter<Partial<ChangePasswordForm>>();

  protected readonly messageErrorNewPasswords = messageErrorNewPasswords;

  onSubmit() {
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }
}
