import { FormGroup } from '@angular/forms';
import { isNil } from 'ramda';

export function MustDifferent(
  controlName: string,
  compareControlName: string,
  ignoreCase = false
) {
  return (formGroup: FormGroup) => {
    const { value: valueOriginal } = formGroup.controls[controlName];
    const { errors, value: valueMatch } =
      formGroup.controls[compareControlName];

    if (isNil(valueOriginal) || isNil(valueMatch)) {
      return;
    }

    if (errors && !errors.mustMatch) {
      return;
    }

    const checkCase = (fieldValue: string) => {
      return ignoreCase ? fieldValue.toLowerCase() : fieldValue;
    };

    if (checkCase(valueOriginal) === checkCase(valueMatch)) {
      formGroup.controls[compareControlName].setErrors({ notEqual: true });
    } else {
      formGroup.controls[compareControlName].setErrors(null);
    }
  };
}
