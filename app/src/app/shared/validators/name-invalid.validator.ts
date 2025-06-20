import {
  type AbstractControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';

export function nameInvalid(name: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === name) {
      return { change: true };
    }
    return null;
  };
}
