import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(
  controlName: string,
  matchingControlName: string,
  useCase = false
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    const checkCase = (fieldValue: string) =>
      useCase ? fieldValue.toLowerCase() : fieldValue;

    // set error on matchingControl if validation fails
    if (checkCase(control.value) !== checkCase(matchingControl.value)) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
