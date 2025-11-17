import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnDestroy,
  type OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CurrenciesCodes, CurrenciesLabels } from '../../constants/currencies';
import { InputWithoutSpacesDirective } from '../../directives/input-without-spaces.directive';
import { IErrorMessages, type ModelFormGroup } from '../../models/forms';
import { type CompanyAccounts } from '../../services/company.service';
import { type ServiceFormValue } from '../../services/services-forms.service';
import { namePattern } from '../../validators/service-validators';
import { LabelControlComponent } from '../label-control/label-control.component';
import { MessageAlertComponent } from '../message-alert/message-alert.component';
import { ServiceChannelChipComponent } from '../service-channel-chip/service-channel-chip.component';

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    InputWithoutSpacesDirective,
    DropdownModule,
    CheckboxModule,
    ServiceChannelChipComponent,
    MessageAlertComponent,
    NgClass,
    ButtonDirective,
    Ripple,
  ],
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
  protected readonly namePattern = namePattern;

  ngOnInit() {
    this.form
      ?.get('account')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value)),
      )
      .subscribe((accountID) => {
        if (isNotNilOrEmpty(accountID)) {
          const selectedAccount = this.accounts.find(
            (account) => account.id === accountID,
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
