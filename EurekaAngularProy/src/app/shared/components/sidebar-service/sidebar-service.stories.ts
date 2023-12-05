import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { SidebarServiceComponent } from './sidebar-service.component';

const meta: Meta<SidebarServiceComponent> = {
  title: 'Shared/Service/Sidebar',
  component: SidebarServiceComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SharedModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<SidebarServiceComponent>;

export const First: Story = { args: { position: 0, existServices: false } };
export const Second: Story = { args: { position: 1, existServices: false } };
export const Third: Story = { args: { position: 0, existServices: true } };
export const Four: Story = { args: { position: 1, existServices: true } };
