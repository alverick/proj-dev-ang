import { Validators } from '@angular/forms';

import { emailRegex } from '../constants/patterns';

export const emailValidators = [
  Validators.required,
  Validators.pattern(emailRegex),
  Validators.minLength(10),
  Validators.maxLength(50),
];
export const rucValidators = [
  Validators.required,
  Validators.minLength(11),
  Validators.maxLength(11),
  Validators.pattern(/^\d+$/),
];
export const rucValidatorsComplete = [
  ...rucValidators,
  Validators.pattern('[1-2]0[0-9]+?'),
];

export const mobileValidators = [
  Validators.required,
  Validators.pattern(/^9\d{8}$/),
  Validators.minLength(9),
  Validators.maxLength(9),
];

export const authNameValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(80),
];
