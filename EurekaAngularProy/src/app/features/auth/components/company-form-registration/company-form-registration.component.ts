import {
  type OnInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Validators } from '@angular/forms';

import {
  type ModelFormGroup,
  IErrorMessages,
} from '../../../../shared/models/forms';
import { type RegisterForm } from '../../services/affiliation-forms.service';

@Component({
  selector: 'cs-company-form-registration',
  templateUrl: './company-form-registration.component.html',
})
export class CompanyFormRegistrationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<Partial<RegisterForm>>();

  text = '';
  documentNumberMax = '8';
  documentNumberFilter: string | RegExp = 'int';
  blockSpecial = /^[a-z0-9]+$/i;
  @Input() registerForm: ModelFormGroup<RegisterForm>;
  @Input() operators = [];
  @Input() documentTypes = [];
  @Input() errorMessages: IErrorMessages;

  ngOnInit() {
    this.setDocumentNumberProps();
    this.registerForm?.get('documentType').valueChanges.subscribe(() => {
      this.registerForm.get('documentNumber').setValue('');
      this.setDocumentNumberProps();
    });
  }

  setDocumentNumberProps() {
    const isDNI = this.registerForm?.value.documentType === 'DNI';
    this.documentNumberMax = isDNI ? '8' : '12';
    this.documentNumberFilter = isDNI ? 'int' : this.blockSpecial;
    const validators = [
      Validators.required,
      Validators.maxLength(parseInt(this.documentNumberMax, 10)),
    ];
    if (isDNI) {
      validators.push(Validators.minLength(8));
    }
    this.registerForm?.get('documentNumber').setValidators(validators);
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.registerForm.value;
    if (this.registerForm.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
