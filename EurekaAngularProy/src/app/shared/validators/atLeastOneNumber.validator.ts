import { FormControl } from '@angular/forms';
import { isNil } from 'ramda';

export function atLeastOneNumber(control: FormControl) {
  const regex = /[0-9]/g;
  if (isNil(control.value)) {
    return null;
  }
  console.log('validate', regex.test(control.value));
  if (control.value && !regex.test(control.value)) {
    return { noNumber: true };
  }
  return null;
}
