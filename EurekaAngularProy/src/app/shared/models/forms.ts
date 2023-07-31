import { FormControl, FormGroup } from '@angular/forms';

export interface IErrorMessages {
  [key: string]: { [key: string]: string };
}

export type ModelFormGroup<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;
