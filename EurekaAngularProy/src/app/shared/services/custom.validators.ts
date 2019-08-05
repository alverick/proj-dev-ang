import { AbstractControl, FormControl, Validators } from "@angular/forms";

export class CustomValidators {
    static RequiredWhen(controlName: string, refName: string, refValue: any) {
        return (form: FormControl) => {
            console.log('custom validate');
            const ctrl = form.get(controlName);
            const ctrlRef = form.get(refName);
            if (ctrl !== null && ctrlRef !== null) {
                console.log(ctrl);
                console.log(ctrlRef);
                if (ctrlRef.value === refValue) {
                    console.log(`${controlName}`)
                    return Validators.required(ctrl);
                }
            }
            return null
        }
    }
}