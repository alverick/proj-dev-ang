import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { LabelControlComponent } from './label-control.component';

const meta: Meta<LabelControlComponent> = {
  title: 'UI/Forms/Label',
  component: LabelControlComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [BrowserAnimationsModule, CommonModule, SharedModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<LabelControlComponent>;

export const Default: Story = {
  render: () => ({
    template: `<cs-label-control class="tw-m-5"
      >Label 1 <input type="text" pInputText />
    </cs-label-control>`,
  }),
};

export const WithHint: Story = {
  render: (args) => ({
    template: `<cs-label-control class="tw-m-5"
      >Label 1 <input type="text" pInputText />
      <div hint class="tw-text-error">
        El nuevo nombre 1 <strong> ${args.onlyControl} </strong> esta siendo procesado
      </div>
    </cs-label-control>`,
  }),
  args: {
    onlyControl: true,
  },
};
