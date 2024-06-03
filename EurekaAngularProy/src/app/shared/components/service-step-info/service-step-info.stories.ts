import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { type ServiceStepInfoComponent } from './service-step-info.component';

const meta: Meta<ServiceStepInfoComponent> = {
  title: 'Auth/Module/Service Form Info',
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<ServiceStepInfoComponent>;

export const Normal: Story = {
  render: (args) => ({
    props: args,
    template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-service-step-info [form]='form' [errorMessages]='errorMessages' [accounts]='accounts'></cs-service-step-info>`,
  }),
  args: {
    accounts: [],
    errorMessages: {
      name: {
        required: 'Ingresa el concepto de cobro',
        pattern: 'Ingrese un nombre correcto',
        minlength: 'El nombre no puede tener menos de 3 caracteres',
        maxlength: 'El nombre no puede tener mas de 80 caracteres',
        alfa: 'El nombre debe tener por lo menos una letra o un numero',
        alfabetico: 'El nombre debe tener por lo menos una letra',
      },
      idAccount: {
        required: 'Elige una opción',
      },
    },
    form: new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      account: new FormControl('', [Validators.required]),
      idAccount: new FormControl('', [Validators.required]),
      currency: new FormControl(''),
      accountNumber: new FormControl(''),
      useAppWeb: new FormControl({ value: true, disabled: true }),
      useAgent: new FormControl(true),
    }),
  },
};
