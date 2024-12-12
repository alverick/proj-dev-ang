import { Directive, Input } from '@angular/core';
import {
  type AbstractControl,
  NG_VALIDATORS,
  type ValidationErrors,
} from '@angular/forms';
import { isNilOrEmpty } from 'ramda-adjunct';

import { type CurrencyWithLimit } from '../constants/currencies';

@Directive({
  selector: '[csAmountMaxValidate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AmountMaxValidateDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class AmountMaxValidateDirective {
  @Input() maxAmountLimits: CurrencyWithLimit[] = [];
  @Input() currencySymbol = '';
  @Input() useLimits = false;
  validate(control: AbstractControl<string>): ValidationErrors {
    if (!this.useLimits || isNilOrEmpty(control.value)) {
      return null;
    }
    const amount = parseFloat(control.value);
    const limit = this.maxAmountLimits.find(
      (currency) => currency.symbol === this.currencySymbol,
    ).limitMax;
    if (amount > limit) {
      return { amountMax: true };
    }
    return null;
  }
}
