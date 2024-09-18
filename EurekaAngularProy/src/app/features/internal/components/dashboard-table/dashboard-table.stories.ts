import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { type TopClient } from '../../../../store/entities';
import { DashboardTableComponent } from './dashboard-table.component';

const meta: Meta<DashboardTableComponent> = {
  title: 'Internal/Dashboard/Dashboard Table',
  component: DashboardTableComponent,
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
