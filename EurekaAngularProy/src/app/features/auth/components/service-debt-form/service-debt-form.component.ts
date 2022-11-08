import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-debt-form',
  templateUrl: './service-debt-form.component.html',
  styleUrls: ['./service-debt-form.component.scss'],
})
export class ServiceDebtFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  showArrearsFields = false;
  unitAmount = 'S/';

  constructor() {}

  ngOnInit() {
    this.listenForms();
  }

  listenForms() {
    this.form.get('chargeInterest').valueChanges.subscribe((val) => {
      this.showArrearsFields = val === 'S';
    });
    this.form.get('interestType').valueChanges.subscribe((val) => {
      this.unitAmount = val === 'M' ? 'S/' : '%';
    });
  }
}
