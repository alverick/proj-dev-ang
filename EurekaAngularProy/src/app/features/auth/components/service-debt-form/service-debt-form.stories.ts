import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../../shared/shared.module';
import { ServiceDebtFormComponent } from './service-debt-form.component';

export default {
  title: 'Auth/Module/Service Debt Form',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [ServiceDebtFormComponent],
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
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults>
<cs-service-debt-form [form]="serviceForm"></cs-service-debt-form>`,
  props: {
    serviceForm: new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(
          '^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$'
        ),
      ]),
      tipoPago: new FormControl('ps1', [Validators.required]),
      cobraMora: new FormControl('no', [Validators.required]),
      orderPayment: new FormControl('', [Validators.required]),
      customerCode: new FormControl('', [Validators.required]),
    }),
  },
});
