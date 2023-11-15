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
  argTypes: { link: { action: 'clicked' } },
} as Meta;

const Template: Story<DashboardCardComponent> = (
  args: DashboardCardComponent
) => ({
  props: args,
});

export const Normal = Template.bind({}) as Story<DashboardCardComponent>;
Normal.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: -50,
  peopleQuantity: 1,
};

export const Empty = Template.bind({}) as Story<DashboardCardComponent>;
Empty.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: 0,
  peopleQuantity: 0,
};

export const skeleton = Template.bind({}) as Story<DashboardCardComponent>;
skeleton.args = {
  title: 'Cobro total',
  currency: 'S/',
  amount: 0,
  loading: true,
  peopleQuantity: 0,
};
