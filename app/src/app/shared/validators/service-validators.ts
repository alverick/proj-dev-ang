import { type FormControl, Validators } from '@angular/forms';
import { isNil } from 'ramda';

export const serviceNameValidators = [
  Validators.required,
  Validators.minLength(3),
  onlyAlphaNumber,
  notBlankSpaces,
];

export function notBlankSpaces(control: FormControl<string>) {
  if (isNil(control.value)) {
    return null;
  }
  if (control.value.trim() === '') {
    return { blankSpaces: true };
  }
  return null;
}

export function onlyAlphaNumber(control: FormControl<string>) {
  const regex = /[0-9a-zA-Z]-?/g;
  if (isNil(control.value)) {
    return null;
  }
  if (control.value && !regex.test(control.value)) {
    return { alfa: true };
  }
  return null;
}

export const namePattern = /[^-\dA-Za-z ]*/g;
