import { FormControl, Validators } from '@angular/forms';

export class CustomValidators {
  static RequiredWhen(controlName: string, refName: string, refValue: any) {
    return (form: FormControl) => {
      const ctrl = form.get(controlName);
      const ctrlRef = form.get(refName);
      if (ctrl !== null && ctrlRef !== null) {
        if (ctrlRef.value === refValue) {
          return Validators.required(ctrl);
        }
      }
      return null;
    };
  }
}
