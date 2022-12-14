import { FormGroup } from '@angular/forms';
import { isNil } from 'ramda';

export function MustMatch(
  controlName: string,
  matchingControlName: string,
  ignoreCase = false
) {
  return (formGroup: FormGroup) => {
    const { value: valueOriginal } = formGroup.controls[controlName];
    const { errors, value: valueMatch } =
      formGroup.controls[matchingControlName];

    if (isNil(valueOriginal) || isNil(valueMatch)) {
      return;
    }

    if (errors && !errors.mustMatch) {
      return;
    }

    const checkCase = (fieldValue: string) => {
      return ignoreCase ? fieldValue.toLowerCase() : fieldValue;
    };

    if (checkCase(valueOriginal) !== checkCase(valueMatch)) {
      formGroup.controls[matchingControlName].setErrors({ mustMatch: true });
    } else {
      formGroup.controls[matchingControlName].setErrors(null);
    }
  };
}
