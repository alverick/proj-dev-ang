import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { DashboardCardComponent } from './dashboard-card.component';

const meta: Meta<DashboardCardComponent> = {
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
};

export default meta;

type Story = StoryObj<DashboardCardComponent>;

export const Normal: Story = {
  args: {
    title: 'Cobro total',
    currency: 'S/',
    amount: -50,
    peopleQuantity: 1,
  },
};

export const Empty: Story = {
  args: {
    title: 'Cobro total',
    currency: 'S/',
    amount: 0,
    peopleQuantity: 0,
  },
};

export const Skeleton: Story = {
  args: {
    title: 'Cobro total',
    currency: 'S/',
    amount: 0,
    loading: true,
    peopleQuantity: 0,
  },
};
