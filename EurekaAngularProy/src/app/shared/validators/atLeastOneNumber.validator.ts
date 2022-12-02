import { FormControl } from '@angular/forms';
import { isNil } from 'ramda';

export function atLeastOneNumber(control: FormControl) {
  const regex = /[0-9]/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { noNumber: true };
  }
  return null;
}
