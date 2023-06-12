import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { isNil } from 'ramda';

import { PasswordForm } from '../../features/internal/services/company-configuration.service';

export function MustMatch(
  controlName: string,
  matchingControlName: string,
  ignoreCase = false
): ValidatorFn {
  return (formGroup: FormGroup<PasswordForm>): ValidationErrors | null => {
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
