import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  styleUrls: ['./service-step-info.component.scss'],
})
export class ServiceStepInfoComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() accounts: any[];

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    const {
      idAccount: { currency, id, number },
    } = this.form.value;
    if (this.form.valid && isNotNilOrEmpty(number)) {
      const accountNumber = `${number.substr(0, 13)} (${
        currency === '001' ? 'Soles' : 'Dólares'
      })`;
      this.form.get('accountNumber').setValue(accountNumber);
      this.form.get('currency').setValue(currency);
      this.form.get('idAccount').setValue(id);
      this.sendForm.emit(this.form.value);
    }
  }
}
