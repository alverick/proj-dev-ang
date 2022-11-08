import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-service-step-info ></cs-service-step-info>`,
  argTypes: { sendForm: { action: 'clicked' } },
});
