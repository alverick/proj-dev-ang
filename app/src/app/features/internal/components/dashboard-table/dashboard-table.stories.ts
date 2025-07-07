import { HttpClientModule } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { type TopClient } from '../../../../store/entities';
import { DashboardTableComponent } from './dashboard-table.component';

const meta: Meta<DashboardTableComponent> = {
  title: 'Internal/Dashboard/Dashboard Table',
  component: DashboardTableComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [BrowserAnimationsModule, HttpClientModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<DashboardTableComponent>;

const customers: TopClient[] = [
  {
    name: 'Pedro',
    lastName: 'Perez',
    code: '12345678',
    service: 'Servicio 1',
    currency: 'S/',
    totalAmount: 100000.0,
    totalDefault: 34,
  },
  {
    code: '12345678',
    name: 'Pedro',
    lastName: 'Perez',
    service: 'Servicio 1',
    currency: 'S/',
    totalAmount: 0,
    totalDefault: 34,
  },
  {
    code: '12345678',
    name: 'Pedro',
    lastName: 'Perez',
    service: 'Servicio 1',
    currency: 'S/',
    totalAmount: 100000.0,
    totalDefault: 34,
  },
  {
    code: '12345678',
    name: 'Pedro',
    lastName: 'Perez',
    service: 'Servicio 1',
    currency: 'S/',
    totalAmount: 100000.0,
    totalDefault: 34,
  },
];

export const Normal: Story = {
  args: {
    customers,
  },
};

export const Empty: Story = {
  args: {
    customers: [],
  },
};
