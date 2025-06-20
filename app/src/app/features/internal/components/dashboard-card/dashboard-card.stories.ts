import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { DashboardCardComponent } from './dashboard-card.component';

const meta: Meta<DashboardCardComponent> = {
  title: 'Internal/Dashboard/Dashboard Card',
  component: DashboardCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [BrowserAnimationsModule, HttpClientModule],
    }),
  ],
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
