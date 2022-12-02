import { Pipe, PipeTransform } from '@angular/core';
import { isNilOrEmpty } from 'ramda-adjunct';

@Pipe({
  name: 'notEmpty',
})
export class NotEmptyPipe implements PipeTransform {
  transform(value: any, replacement: string = ''): any {
    return isNilOrEmpty(value) ? replacement : value;
  }
}
