import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { forEachObjIndexed, pathOr } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

@Component({
  selector: 'cs-company-form-registration',
  templateUrl: './company-form-registration.component.html',
  styleUrls: ['./company-form-registration.component.scss'],
})
export class CompanyFormRegistrationComponent implements OnInit {
  @Output() sendForm = new EventEmitter<object>();

  registerForm: FormGroup;
  inEdit = false;
  submitted = false;
  errorMessages = {
    ruc: {
      required: 'El RUC es obligatorio',
      pattern: 'Ingrese un ruc válido',
      minlength: 'El ruc debe tener 11 dígitos',
    },
    email: {
      required: 'El correo electrónico  es obligatorio',
      pattern: 'Ingrese un correo electrónico  válido',
      minlength: 'El correo electrónico debe tener mínimo 10 dígitos',
    },
    emailConfirm: {
      required: 'Confirmar correo electrónico  es obligatorio',
      notSame: 'El correo ingresado no coincide con el anterior',
    },
    telefono: {
      required: 'Teléfono o celular es obligatorio',
      pattern: 'Teléfono o celular es obligatorio',
      minlength: 'El teléfono o celular debe tener mínimo 9 dígitos',
    },
    movilOperator: {
      required: 'Elija una opción',
    },
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const emailValidators = [
      Validators.required,
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
      Validators.minLength(10),
      Validators.maxLength(100),
    ];
    this.registerForm = this.formBuilder.group({
      ruc: new FormControl({ value: '', disabled: this.inEdit }, [
        Validators.required,
        Validators.pattern('[1-2]0[0-9]+?'),
        Validators.minLength(11),
      ]),
      email: new FormControl(
        { value: '', disabled: this.inEdit },
        emailValidators
      ),
      emailConfirm: new FormControl({ value: '', disabled: this.inEdit }, [
        Validators.required,
        this.checkEmail(),
      ]),
      telefono: new FormControl({ value: '', disabled: this.inEdit }, [
        Validators.required,
        Validators.pattern(/^9\d{8}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      movilOperator: new FormControl('', [Validators.required]),
    });

    this.registerForm.controls.email.statusChanges.subscribe(() => {
      this.registerForm.controls.emailConfirm.updateValueAndValidity();
    });
  }

  checkEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailConfirm = control.value as string;
      const email = pathOr(
        '',
        ['parent', 'controls', 'email', 'value'],
        control
      ) as string;
      return email.toLowerCase() === emailConfirm.toLowerCase()
        ? null
        : { notSame: true };
    };
  }

  getErrorMessage(
    controlName: FormControl | AbstractControl,
    errors: {
      [key: string]: string;
    }
  ): string {
    let result = '';
    forEachObjIndexed((value, key) => {
      if (isNotNil(errors[key])) {
        result = errors[key];
        return;
      }
    }, controlName.errors);
    return result;
  }

  onSubmit() {
    this.submitted = true;
    const { emailConfirm, ...formValue } = this.registerForm.value;
    if (this.registerForm.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
