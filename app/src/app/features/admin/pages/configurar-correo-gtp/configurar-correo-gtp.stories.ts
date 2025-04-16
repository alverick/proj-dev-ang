import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { GtpService } from '../../../../shared/services/gtp.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ConfigurarCorreoGtpComponent } from './configurar-correo-gtp.component';

const meta: Meta<ConfigurarCorreoGtpComponent> = {
  title: 'Admin/Pages/Configurar correo Gtp',
  component: ConfigurarCorreoGtpComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [HttpClientModule, CommonModule, SharedModule],
      providers: [GtpService],
    }),
  ],
};

export default meta;

type Story = StoryObj<ConfigurarCorreoGtpComponent>;
export const Normal: Story = {};
