import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-edit-form',
  templateUrl: './service-edit-form.component.html',
  styleUrls: ['./service-edit-form.component.scss'],
})
export class ServiceEditFormComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  debtForm: FormGroup;
  debtorCodeEditable = false;

  constructor() {}

  ngOnInit() {
    this.debtForm = this.form.get('debt') as FormGroup;
    this.listenForChanges();
  }

  listenForChanges() {
    this.form.get('debtorCode').valueChanges.subscribe((val) => {
      console.log('-> val', val);
      this.debtorCodeEditable = val === 'Otro';
      if (val === 'Otro') {
        this.form.get('debtorCode').setValue('');
      }
    });
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.form.value;
    console.log('-> formValue', formValue, this.form);
    if (this.form.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
