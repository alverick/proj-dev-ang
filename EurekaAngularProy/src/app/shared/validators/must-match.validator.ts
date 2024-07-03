import {
  type FormControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { isNil } from 'ramda';

import { type ChangePasswordForm } from '../../features/internal/services/company-configuration.service';
import { type ModelFormGroup } from '../models/forms';

export function MustMatch(
  controlName: string,
  matchingControlName: string,
  ignoreCase = false
): ValidatorFn {
  return (
    formGroup: ModelFormGroup<ChangePasswordForm>
  ): ValidationErrors | null => {
    const { value: valueOriginal } = formGroup.controls[
      controlName
    ] as FormControl<string>;
    const matchingControl = formGroup.controls[
      matchingControlName
    ] as FormControl<string>;
    const { errors, value: valueMatch } = matchingControl;

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
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
