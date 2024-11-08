import { Pipe, type PipeTransform } from '@angular/core';

import { type CurrencyWithLimit } from '../constants/currencies';

@Pipe({
  name: 'getLimitCurrency',
  standalone: true,
})
export class GetLimitCurrencyPipe implements PipeTransform {
  transform(currencySel: string, maxAmountLimits: CurrencyWithLimit[]) {
    return maxAmountLimits.find((currency) => currency.symbol === currencySel)
      .limitMax;
  }
}
