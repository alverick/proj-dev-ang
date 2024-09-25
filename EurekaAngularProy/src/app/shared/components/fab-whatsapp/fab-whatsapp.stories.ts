import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { FabWhatsappComponent } from './fab-whatsapp.component';

const meta: Meta<FabWhatsappComponent> = {
  title: 'Shared/UI/Button Whatsapp',
  component: FabWhatsappComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<FabWhatsappComponent>;

export const Normal: Story = {
  args: {
    showButton: true,
    expand: true,
  },
};
