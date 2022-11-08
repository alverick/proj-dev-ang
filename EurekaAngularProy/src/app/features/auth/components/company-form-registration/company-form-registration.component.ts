import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-form-registration',
  templateUrl: './company-form-registration.component.html',
  styleUrls: ['./company-form-registration.component.scss'],
})
export class CompanyFormRegistrationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<DataEnterpriseModel>();

  text = '';
  documentNumberMax = '8';
  documentNumberFilter: string | RegExp = 'int';
  blockSpecial: RegExp = /^[a-z0-9]+$/i;
  @Input() registerForm: FormGroup;
  @Input() operators = [];
  @Input() documentTypes = [];
  @Input() errorMessages: IErrorMessages;
  constructor() {}

  ngOnInit() {
    this.registerForm.get('documentType').valueChanges.subscribe((value) => {
      console.log('-> value', value);
      this.registerForm.get('documentNumber').setValue('');
      this.setDocumentNumberProps();
    });
  }

  setDocumentNumberProps() {
    const isDNI = this.registerForm.value.documentType === 'DNI';
    this.documentNumberMax = isDNI ? '8' : '12';
    this.documentNumberFilter = isDNI ? 'int' : this.blockSpecial;
    const validators = [
      Validators.required,
      Validators.maxLength(parseInt(this.documentNumberMax, 10)),
    ];
    if (isDNI) {
      validators.push(Validators.minLength(8));
    }
    this.registerForm.get('documentNumber').setValidators(validators);
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.registerForm.value;
    console.log('-> formValue', formValue);
    if (this.registerForm.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
