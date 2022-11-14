import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { pathEq } from 'ramda';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-debt-form',
  templateUrl: './service-debt-form.component.html',
  styleUrls: ['./service-debt-form.component.scss'],
})
export class ServiceDebtFormComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() submitted = false;
  @ViewChild('formElm', { static: false })
  htmlForm: NgForm;
  showArrearsFields = false;
  unitAmount = 'S/';

  constructor() {}

  ngOnInit() {
    const { chargeInterest, interestType } = this.form.value;
    this.processArrearsMode(chargeInterest === 'S');
    this.unitAmount = interestType === 'M' ? 'S/' : '%';
    this.listenForms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (pathEq(['submitted', 'currentValue'], true, changes) && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }

  processArrearsMode(show: boolean) {
    this.showArrearsFields = show;
    ['chargeType', 'interestType', 'amount'].forEach((field) => {
      if (show) {
        this.form.get(field).enable();
      } else {
        this.form.get(field).disable();
      }
    });
  }

  listenForms() {
    this.form.get('chargeInterest').valueChanges.subscribe((val) => {
      this.processArrearsMode(val === 'S');
    });
    this.form.get('interestType').valueChanges.subscribe((val) => {
      this.unitAmount = val === 'M' ? 'S/' : '%';
    });
  }

  ngAfterViewInit(): void {
    if (this.submitted && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }
}
