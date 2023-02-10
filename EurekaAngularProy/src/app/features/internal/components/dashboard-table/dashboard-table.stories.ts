import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta } from '@storybook/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
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

export const Normal = Template.bind({});
Normal.args = {
  customers: [
    {
      id: '12345678',
      name: 'Pedro Perez',
      service: 'Servicio 1',
      currency: 'S/',
      totalAmount: '100000.00',
      delayAmount: '34',
    },
    {
      id: '12345678',
      name: 'Pedro Perez',
      service: 'Servicio 1',
      currency: 'S/',
      totalAmount: '100000.00',
      delayAmount: '34',
    },
    {
      id: '12345678',
      name: 'Pedro Perez',
      service: 'Servicio 1',
      currency: 'S/',
      totalAmount: '100000.00',
      delayAmount: '34',
    },
    {
      id: '12345678',
      name: 'Pedro Perez',
      service: 'Servicio 1',
      currency: 'S/',
      totalAmount: '100000.00',
      delayAmount: '34',
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  customers: [],
};
