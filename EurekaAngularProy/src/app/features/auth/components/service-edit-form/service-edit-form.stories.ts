import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../../shared/shared.module';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';
import { ServiceEditFormComponent } from './service-edit-form.component';

export default {
  title: 'Auth/Module/Service Edit Form',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [ServiceEditFormComponent, ServiceDebtFormComponent],
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
  component: ServiceEditFormComponent,
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-service-edit-form ></cs-service-edit-form>`,
  argTypes: { sendForm: { action: 'clicked' } },
});
