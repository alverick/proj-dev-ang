import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { CompanyFormAuthComponent } from './company-form-auth.component';

export default {
  title: 'Auth/Module/Company Form Fill',
  decorators: [
    moduleMetadata({
      declarations: [CompanyFormAuthComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
};

export const normal = () => ({
  component: CompanyFormAuthComponent,
  template: `<cs-validation-defaults class="tw-hidden"></cs-validation-defaults><cs-company-form-auth></cs-company-form-auth>`,
  argTypes: { sendForm: { action: 'clicked' } },
});
