import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta } from '@storybook/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { TopClient } from '../../../../store/entities';
import { DashboardTableComponent } from './dashboard-table.component';

export default {
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
} as Meta;

const Template: Story<DashboardTableComponent> = (
  args: DashboardTableComponent
) => ({
  props: args,
});

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

export const Normal = Template.bind({});
Normal.args = {
  customers,
};

export const Empty = Template.bind({});
Empty.args = {
  customers: [],
};
