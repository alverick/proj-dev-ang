import {
  type OnDestroy,
  type OnInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CurrenciesCodes, CurrenciesLabels } from '../../constants/currencies';
import { type ModelFormGroup, IErrorMessages } from '../../models/forms';
import { type CompanyAccounts } from '../../services/company.service';
import { type ServiceFormValue } from '../../services/services-forms.service';

export type ServiceFormValueAccount = ServiceFormValue & {
  account: CompanyAccounts;
};

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  styleUrls: ['./service-step-info.component.scss'],
})
export class ServiceStepInfoComponent implements OnInit, OnDestroy {
  $destroy = new Subject();
  disclaimerCommissionDollars = false;
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  @Input() form: ModelFormGroup<ServiceFormValueAccount>;
  @Input() errorMessages: IErrorMessages;
  @Input() accounts: CompanyAccounts[];
  @Input() showCancel = false;

  ngOnInit() {
    this.form
      ?.get('account')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value))
      )
      .subscribe(({ currency = '', id = '', number = '' }) => {
        if (isNotNilOrEmpty(number)) {
          const accountNumber = `${number.substr(0, 13)} (${
            currency === CurrenciesCodes.soles
              ? CurrenciesLabels.soles
              : CurrenciesLabels.dollars
          })`;
          this.disclaimerCommissionDollars = currency !== CurrenciesCodes.soles;
          this.form.get('accountNumber').setValue(accountNumber);
          this.form.get('currency').setValue(currency);
          this.form.get('idAccount').setValue(id);
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
