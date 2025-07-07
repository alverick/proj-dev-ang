import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { GtpService } from '../../../../shared/services/gtp.service';
import { ConfigurarCorreoGtpComponent } from './configurar-correo-gtp.component';

const meta: Meta<ConfigurarCorreoGtpComponent> = {
  title: 'Admin/Pages/Configurar correo Gtp',
  component: ConfigurarCorreoGtpComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [GtpService],
    }),
  ],
};

export default meta;

type Story = StoryObj<ConfigurarCorreoGtpComponent>;
export const Normal: Story = {};
