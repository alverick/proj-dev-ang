import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta } from '@storybook/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { DashboardGraphComponent } from './dashboard-graph.component';

export default {
  title: 'Internal/Dashboard/Dashboard Graph',
  component: DashboardGraphComponent,
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

const Template: Story<DashboardGraphComponent> = (
  args: DashboardGraphComponent
) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {
  serviceData: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  },
};

export const Empty = Template.bind({});
Empty.args = {
  serviceData: {
    labels: [],
    datasets: [],
  },
};
