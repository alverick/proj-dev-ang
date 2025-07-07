import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { DashboardGraphComponent } from './dashboard-graph.component';

const meta: Meta<DashboardGraphComponent> = {
  title: 'Internal/Dashboard/Dashboard Graph',
  component: DashboardGraphComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [HttpClientModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<DashboardGraphComponent>;

export const Normal: Story = {
  args: {
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
  },
};

export const Empty: Story = {
  args: {
    serviceData: {
      labels: [],
      datasets: [],
    },
  },
};
