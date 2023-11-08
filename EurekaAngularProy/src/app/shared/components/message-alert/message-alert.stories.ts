import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  argsToTemplate,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { MessageAlertComponent } from './message-alert.component';

type MessageAlertAndMessage = MessageAlertComponent & { content: string };

const meta: Meta<MessageAlertAndMessage> = {
  title: 'UI/Message alert',
  component: MessageAlertComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    mode: {
      options: ['info'],
      control: { type: 'select' },
    },
  },
  render: ({ content, ...args }) => ({
    props: args,
    template: `<cs-message-alert ${argsToTemplate(
      args
    )}>${content}</cs-message-alert>`,
  }),
};

export default meta;
type Story = StoryObj<MessageAlertAndMessage>;

export const Params: Story = {
  args: {
    mode: 'info',
    content:
      'Nombre con el que tus clientes te buscarán en los canales Interbank al momento de pagarte.',
  },
};
