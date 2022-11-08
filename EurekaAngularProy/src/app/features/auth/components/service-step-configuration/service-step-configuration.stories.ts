import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../../shared/shared.module';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

export default {
  title: 'Auth/Module/Service Form Configuration',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [
        ServiceStepConfigurationComponent,
        ServiceDebtFormComponent,
      ],
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
  component: ServiceStepConfigurationComponent,
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-service-step-configuration></cs-service-step-configuration>`,
  argTypes: { sendForm: { action: 'clicked' } },
});
