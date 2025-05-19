import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';
import { of } from 'rxjs';

import { initialState } from '../../../../shared/mocks/store';
import { TrackingService } from '../../../../shared/services';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { AdminHeaderComponent } from './admin-header.component';

const mockActivatedRoute = {
  params: of({}),
  snapshot: {
    params: {},
    data: {},
  },
};

const meta: Meta<AdminHeaderComponent> = {
  title: 'Admin/Admin Header',
  component: AdminHeaderComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [HttpClientModule],
      providers: [
        LoginService,
        AfiliacionService,
        ExcelService,
        NotifyService,
        StorageService,
        TrackingService,
        Store,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({ initialState }),
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<AdminHeaderComponent>;

export const Normal: Story = {
  args: {},
};
