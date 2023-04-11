import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta } from '@storybook/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { FabWhatsappComponent } from './fab-whatsapp.component';

export default {
  title: 'Shared/UI/Button Whatsapp',
  component: FabWhatsappComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
  argTypes: { link: { action: 'clicked' } },
} as Meta;

const Template: Story<FabWhatsappComponent> = (args: FabWhatsappComponent) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: -50,
  peopleQuantity: 1,
};
