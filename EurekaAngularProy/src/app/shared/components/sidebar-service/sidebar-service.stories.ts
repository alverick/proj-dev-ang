import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { SidebarServiceComponent } from './sidebar-service.component';

const meta: Meta<SidebarServiceComponent> = {
  title: 'Shared/Service/Sidebar',
  component: SidebarServiceComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      imports: [],
    }),
  ],
};

export default meta;

type Story = StoryObj<SidebarServiceComponent>;

export const FirstWithoutServices: Story = {
  args: { position: 0, existServices: false, showAllTypes: false },
};
export const SecondWithoutServices: Story = {
  args: { ...FirstWithoutServices.args, position: 1 },
};
export const SecondWithoutServicesFull: Story = {
  args: { ...SecondWithoutServices, showAllTypes: true },
};
export const FirstWithServices: Story = {
  args: { ...FirstWithoutServices, existServices: true },
};
export const SecondWithServices: Story = {
  args: { ...FirstWithServices, position: 1 },
};
export const SecondWithServicesFull: Story = {
  args: { ...SecondWithServices, showAllTypes: true },
};
