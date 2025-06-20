import { type FormControl, type ValidationErrors } from '@angular/forms';
import { isNil } from 'ramda';

import { type CompanyChangePasswordForm } from '../models/company-forms';
import { type ModelFormGroup } from '../models/forms';

export function MustDifferent(
  controlName: string,
  compareControlName: string,
  ignoreCase = false,
) {
  return (
    formGroup: ModelFormGroup<CompanyChangePasswordForm>,
  ): ValidationErrors | null => {
    const { value: valueOriginal } = formGroup.controls[
      controlName
    ] as FormControl<string>;
    const compareControl = formGroup.controls[
      compareControlName
    ] as FormControl<string>;
    const { errors, value: valueMatch } = compareControl;

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
      compareControl.setErrors({ notEqual: true });
    } else {
      compareControl.setErrors(null);
    }
  };
}
