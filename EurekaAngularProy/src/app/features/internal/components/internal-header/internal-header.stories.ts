import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
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

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { initialState } from '../../../../shared/mocks/store';
import { TrackingService } from '../../../../shared/services';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { SharedModule } from '../../../../shared/shared.module';
import { InternalHeaderComponent } from './internal-header.component';

const meta: Meta<InternalHeaderComponent> = {
  title: 'Internal/Internal Header',
  component: InternalHeaderComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [
        HeaderComponent,
        CommonModule,
        SharedModule,
        HttpClientModule,
        NgOptimizedImage,
        RouterTestingModule,
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
