import { FormControl, FormGroup } from '@angular/forms';

export interface IErrorMessages {
  [key: string]: { [key: string]: string };
}

export type SimpleModelFormGroup<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;

export type ModelFormGroup<T> = FormGroup<ControlsOf<T>>;

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
