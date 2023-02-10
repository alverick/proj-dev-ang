import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta } from '@storybook/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { DashboardCardComponent } from './dashboard-card.component';

export default {
  title: 'Internal/Dashboard/Dashboard Card',
  component: DashboardCardComponent,
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
  argTypes: { sendForm: { action: 'clicked' } },
} as Meta;

const Template: Story<DashboardCardComponent> = (
  args: DashboardCardComponent
) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: '100000.00',
  peopleQuantity: '1234',
  link: '#home',
};

export const Empty = Template.bind({});
Empty.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: '',
  peopleQuantity: '0',
  link: '#home',
};
