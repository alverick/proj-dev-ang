import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { DialogService } from 'primeng/dynamicdialog';

import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'UI/Footer',
  component: FooterComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations(), DialogService] }),
  ],
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  render: ({ ...args }) => ({
    props: args,
    template: '<div style="width: 1100px"><cs-footer></cs-footer></div>',
  }),
};
