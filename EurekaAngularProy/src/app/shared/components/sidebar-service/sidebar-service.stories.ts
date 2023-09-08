import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { SidebarServiceComponent } from './sidebar-service.component';

export default {
  title: 'Shared/Service/Sidebar',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SharedModule],
    }),
  ],
};

const Template: Story<SidebarServiceComponent> = (
  args: SidebarServiceComponent
) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {};

export const normal = () => ({
  moduleMetadata: {
    declarations: [],
    providers: [],
  },
  template: `  <cs-sidebar-service
    class="info tw-relative"
    [position]="position"
    [existServices]="true"
  ></cs-sidebar-service>`,
  props: {
    position: 1,
  },
});
