import { KeyValuePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ValidationErrorDirective,
  ValidationErrorsComponent,
} from 'ngx-valdemort';
import { ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Ripple } from 'primeng/ripple';

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
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    DropdownModule,
    InputTextModule,
    KeyFilterModule,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    InputTrimSpacesDirective,
    ButtonDirective,
    Ripple,
    KeyValuePipe,
  ],
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
