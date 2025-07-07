import { Pipe, type PipeTransform } from '@angular/core';
import { isNilOrEmpty } from 'ramda-adjunct';

@Pipe({
  name: 'notEmpty',
  standalone: true,
})
export class NotEmptyPipe implements PipeTransform {
  transform<T>(value: T, replacement: string = ''): T | string {
    return isNilOrEmpty(value) ? replacement : value;
  }
}
