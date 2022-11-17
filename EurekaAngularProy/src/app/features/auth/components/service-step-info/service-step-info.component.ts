import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  styleUrls: ['./service-step-info.component.scss'],
})
export class ServiceStepInfoComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() accounts: any[];
  @Input() showCancel = false;

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const { idAccount } = this.form.value;
      const accountNumber = `${idAccount.number.substr(0, 13)} (${
        idAccount.currency === '001' ? 'Soles' : 'Dólares'
      })`;
      this.form.get('accountNumber').setValue(accountNumber);
      this.form.get('currency').setValue(idAccount.currency);
      this.form.get('idAccount').setValue(idAccount.id);
      const { emailConfirm, ...formValue } = this.form.value;
      this.sendForm.emit({ ...formValue });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
