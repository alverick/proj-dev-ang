import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { mobileOperators } from '../../constants/company';
import { ServicesFormsService } from '../../services';
import { SharedModule } from '../../shared.module';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';

@NgModule({
  imports: [CommonModule, SharedModule],
})
class FormDemoModule {}

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-service-step-info
    [form]="form"
    [errorMessages]="errors"
    [accounts]="accounts"
    [showCancel]="showCancel"
    (sendForm)="onSubmit($event)"
    (cancel)="onCancel()"
  ></cs-service-step-info>`,
  standalone: true,
  imports: [FormDemoModule, SharedModule],
})
class FormDemoComponent {
  form: FormGroup = this.serviceForms.serviceForm;
  operators = mobileOperators;
  accounts: [];
  showCancel: false;
  errors: {
    name: {
      required: 'Ingresa el concepto de cobro';
      pattern: 'Ingrese un nombre correcto';
      minlength: 'El nombre no puede tener menos de 3 caracteres';
      maxlength: 'El nombre no puede tener mas de 80 caracteres';
      alfa: 'El nombre debe tener por lo menos una letra o un numero';
      alfabetico: 'El nombre debe tener por lo menos una letra';
    };
    account: {
      required: 'Elige una opción';
    };
  };
  // documentTypes = documentTypes;
  submitted = false;
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private serviceForms: ServicesFormsService,
  ) {
    // this.registerForm = this.fb.group({
    //   name: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(3),
    //       Validators.pattern(
    //         '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$',
    //       ),
    //     ],
    //   ],
    //   account: ['', [Validators.required]],
    //   idAccount: ['', [Validators.required]],
    //   currency: [''],
    //   accountNumber: [''],
    //   useAppWeb: [{ value: true, disabled: true }],
    //   useAgent: [true],
    // });
    // this.registerForm.patchValue({
    //   ruc: '20000000005',
    //   name: 'demo 5',
    //   entry: '01',
    //   email: 'mnieva@gmail.com',
    //   movilNumber: '123456',
    //   movilOperator: 'C',
    //   documentType: 'DNI',
    //   documentNumber: '28235624',
    //   newName: null,
    //   newNameGTPStatus: 1,
    //   status: 'Pendiente',
    //   inReview: true,
    //   requestDate: '2019-12-16T23:03:16.675169',
    // });
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
  onCancel() {
    this.cancel.emit();
  }
}

const meta: Meta<FormDemoComponent> = {
  title: 'Auth/Module/Service Form Info',
  component: FormDemoComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      declarations: [ValidationDefaultsComponent],
      imports: [HttpClientModule, CommonModule, SharedModule],
    }),
  ],
};
export default meta;

type Story = StoryObj<FormDemoComponent>;

export const Normal: Story = {
  args: {
    accounts: [],
  },
};
