import { KeyValuePipe } from '@angular/common';
import { Component, input, type OnInit, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ValidationErrorDirective,
  ValidationErrorsComponent,
} from 'ngx-valdemort';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule, KeyFilterPattern } from 'primeng/keyfilter';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { InputTrimSpacesDirective } from '../../../../shared/directives/input-trim-spaces.directive';
import {
  IErrorMessages,
  type ModelFormGroup,
} from '../../../../shared/models/forms';
import { type RegisterForm } from '../../services/affiliation-forms.service';

@Component({
  selector: 'cs-company-form-registration',
  templateUrl: './company-form-registration.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    KeyFilterModule,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    InputTrimSpacesDirective,
    ButtonDirective,
    Ripple,
    KeyValuePipe,
    Select,
  ],
})
export class CompanyFormRegistrationComponent implements OnInit {
  readonly sendForm = output<Partial<RegisterForm>>();

  text = '';
  documentNumberMax = '8';
  documentNumberFilter: KeyFilterPattern | RegExp = 'int';
  blockSpecial = /^[a-z0-9]+$/i;
  readonly registerForm = input<ModelFormGroup<RegisterForm>>(undefined);
  readonly operators = input([]);
  readonly documentTypes = input([]);
  readonly errorMessages = input<IErrorMessages>(undefined);

  ngOnInit() {
    this.setDocumentNumberProps();
    this.registerForm()
      ?.get('documentType')
      .valueChanges.subscribe(() => {
        this.registerForm().get('documentNumber').setValue('');
        this.setDocumentNumberProps();
      });
  }

  setDocumentNumberProps() {
    const registerForm = this.registerForm();
    const documentType = registerForm?.value.documentType;
    const isDNI = documentType === 'DNI';
    const isCE = documentType === 'CE';
    const isPASS = documentType === 'PASS';

    this.documentNumberFilter = isDNI ? 'pint' : this.blockSpecial;
    const validators = [
      Validators.required,
      Validators.maxLength(parseInt(this.documentNumberMax, 10)),
    ];

    if (isDNI) {
      validators.push(Validators.minLength(8));
      this.documentNumberMax = '8';
    } else if (isCE) {
      validators.push(Validators.minLength(4));
      validators.push(Validators.maxLength(11));
      this.documentNumberMax = '11';
    } else if (isPASS) {
      validators.push(Validators.minLength(7));
      validators.push(Validators.maxLength(12));
      this.documentNumberMax = '12';
    }

    registerForm?.get('documentNumber').setValidators(validators);
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.registerForm().value;
    if (this.registerForm().valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
