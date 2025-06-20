import { type Meta, type StoryObj } from '@storybook/angular';
import { ProgressBar } from 'primeng/progressbar';

const meta: Meta<ProgressBar> = {
  title: 'UI/PrimeNG/Progress Bar',
  component: ProgressBar,
};

export default meta;

type Story = StoryObj<ProgressBar>;
export const Normal: Story = {
  args: {
    mode: 'indeterminate',
  },
};
export const Determinate: Story = {
  args: {
    mode: 'determinate',
    value: 100,
    styleClass: 'tw-h-1 tw-my-4',
  },
};
