import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { ProgressBarModule } from 'primeng/progressbar';

import { ExcelService } from '../../services/excel.service';
import { LoadFileComponent } from './load-file.component';

const meta: Meta<LoadFileComponent> = {
  title: 'Shared/UI/Load file',
  component: LoadFileComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientTestingModule, ProgressBarModule],
      providers: [{ provide: ExcelService, useValue: { statusUpload: true } }],
    }),
  ],
};

export default meta;

type Story = StoryObj<LoadFileComponent>;

export const Default: Story = {
  args: {
    progress: {
      status: 'Subiendo',
      mode: 'indeterminate',
      value: 0,
    },
  },
};
