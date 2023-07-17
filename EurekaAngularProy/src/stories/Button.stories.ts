import { Meta, StoryObj } from '@storybook/angular';

import Button from './button.component';

const meta: Meta<Button> = {
  title: 'Example/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {};

export const WithProp: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
