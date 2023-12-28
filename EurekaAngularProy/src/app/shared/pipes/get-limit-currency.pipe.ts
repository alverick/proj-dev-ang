import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyWithLimit } from '../constants/currencies';

@Pipe({
  name: 'getLimitCurrency',
})
export class GetLimitCurrencyPipe implements PipeTransform {
  transform(currencySel: string, maxAmountLimits: CurrencyWithLimit[]) {
    return maxAmountLimits.find((currency) => currency.symbol === currencySel)
      .limitMax;
  }
}
