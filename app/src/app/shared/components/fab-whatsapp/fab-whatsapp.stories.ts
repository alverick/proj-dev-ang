import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { TrackingService } from '../../services';
import { StorageService } from '../../services/storage.service';
import { FabWhatsappComponent } from './fab-whatsapp.component';

const meta: Meta<FabWhatsappComponent> = {
  title: 'Shared/UI/Button Whatsapp',
  component: FabWhatsappComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      providers: [TrackingService, StorageService],
      imports: [HttpClientModule],
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
