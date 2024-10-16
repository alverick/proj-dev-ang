import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { http, HttpResponse } from 'msw';
import { CookieService } from 'ngx-cookie-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { environment } from '../../../../../../../environments/environment';
import { initialState } from '../../../../../../shared/mocks/store';
import { TrackingService } from '../../../../../../shared/services';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { TransactionService } from '../../../../../../shared/services/transaction.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PaymentDetailComponent } from './payment-detail.component';

function initAppComponentFactory(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer,
) {
  return async () => {
    matIconRegistry.addSvgIcon(
      'eurc_trash',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/trash.svg'),
      { viewBox: '0 0 24 24' },
    );
  };
}

const meta: Meta<PaymentDetailComponent> = {
  title: 'Internal/Home/Payment Detail',
  component: PaymentDetailComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        LetDirective,
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
        MatDialogModule,
      ],
      providers: [
        Store,
        provideMockStore({ initialState }),
        CookieService,
        TransactionService,
        DynamicDialogRef,
        StorageService,
        TrackingService,
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [MatIconRegistry, DomSanitizer],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
        },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              debtId: 1238992,
              status: 'VENCIDO',
              serviceType: 'C',
              currency: 'S/',
              customer: {
                name: '3444',
                code: '3242334545',
              },
            },
          },
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<PaymentDetailComponent>;

export const Normal: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`${environment.END_POINT}/payment/ofDebt/1238992`, () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const WithData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`${environment.END_POINT}/payment/ofDebt/1238992`, () => {
          return HttpResponse.json([
            {
              id: 110,
              currency: 'S/',
              amount: 50.2,
              date: '2023-03-09T12:45:40.2666667',
              channel: 'Efectivo',
              number: '',
              canEdit: true,
            },
            {
              id: 111,
              currency: 'S/',
              amount: 50.3,
              date: '2023-03-10T12:45:40.2666667',
              channel: 'Efectivo',
              number: '4333',
              canEdit: false,
            },
          ]);
        }),
      ],
    },
  },
};

export const Editing: Story = {
  args: {
    isEditingRow: true,
  },
};

export const Loader: Story = {
  args: {
    loading: true,
  },
};
