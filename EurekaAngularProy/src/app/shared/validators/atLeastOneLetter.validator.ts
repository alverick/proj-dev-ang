import { FormControl } from '@angular/forms';
import { isNil } from 'ramda';

export function atLeastOneLetter(control: FormControl) {
  const regex = /[a-zA-Z]/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { noLetter: true };
  }
  return null;
}
