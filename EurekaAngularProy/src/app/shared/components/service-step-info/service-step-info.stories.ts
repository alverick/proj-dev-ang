import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  submitted = false;
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  constructor(private readonly serviceForms: ServicesFormsService) {}
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
