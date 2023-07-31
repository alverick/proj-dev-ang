import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  IErrorMessages,
  ModelFormGroup,
} from '../../../../shared/models/forms';
import { messageErrorNewPasswords } from '../../../../shared/validators/password-validators';
import { ChangePasswordForm } from '../../services/company-configuration.service';

@Component({
  selector: 'cs-company-password-form',
  templateUrl: './company-password-form.component.html',
  styleUrls: ['./company-password-form.component.scss'],
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
