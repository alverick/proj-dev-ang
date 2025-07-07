import { NgOptimizedImage } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';
import { of } from 'rxjs';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { initialState } from '../../../../shared/mocks/store';
import { TrackingService } from '../../../../shared/services';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { InternalHeaderComponent } from './internal-header.component';

const mockActivatedRoute = {
  params: of({}),
  snapshot: {
    params: {},
    data: {},
  },
};

const meta: Meta<InternalHeaderComponent> = {
  title: 'Internal/Internal Header',
  component: InternalHeaderComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        NgOptimizedImage,
        NgScrollbarModule,
        NgScrollReached,
      ],
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

type Story = StoryObj<InternalHeaderComponent>;

export const Normal: Story = {
  args: {
    showMenu: true,
  },
};
