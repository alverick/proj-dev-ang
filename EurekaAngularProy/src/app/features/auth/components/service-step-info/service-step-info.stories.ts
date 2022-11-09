import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../../shared/shared.module';
import { ServiceStepInfoComponent } from './service-step-info.component';

export default {
  title: 'Auth/Module/Service Form Info',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [ServiceStepInfoComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  component: ServiceStepInfoComponent,
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-service-step-info [form]='serviceForm' [errorMessages]='errors' [accounts]='accounts'></cs-service-step-info>`,
  props: {
    accounts: [],
    errors: {
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
    serviceForm: new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      idAccount: new FormControl('', [Validators.required]),
      currency: new FormControl(''),
      accountNumber: new FormControl(''),
      useAppWeb: new FormControl(''),
      useAgent: new FormControl(''),
    }),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
