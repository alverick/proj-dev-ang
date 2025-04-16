import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { PaymentDetailComponent } from './payment-detail.component';

const meta: Meta<PaymentDetailComponent> = {
  title: 'Internal/Home/Payment Detail',
  component: PaymentDetailComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [BrowserAnimationsModule, HttpClientModule],
      providers: [
        Store,
        provideMockStore({ initialState }),
        CookieService,
        TransactionService,
        DynamicDialogRef,
        StorageService,
        TrackingService,
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
