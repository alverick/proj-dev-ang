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
  @Input() form: ModelFormGroup<ServiceFormValue>;
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
      .subscribe((accountID) => {
        if (isNotNilOrEmpty(accountID)) {
          const selectedAccount = this.accounts.find(
            (account) => account.id === accountID
          );
          const accountNumber = `${selectedAccount.number.substring(0, 13)} (${
            selectedAccount.currency === CurrenciesCodes.soles
              ? CurrenciesLabels.soles
              : CurrenciesLabels.dollars
          })`;

          this.disclaimerCommissionDollars =
            selectedAccount.currency !== CurrenciesCodes.soles;
          this.form.get('accountNumber').setValue(accountNumber);
          this.form.get('currency').setValue(selectedAccount.currency);
          this.form.get('idAccount').setValue(accountID);
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
