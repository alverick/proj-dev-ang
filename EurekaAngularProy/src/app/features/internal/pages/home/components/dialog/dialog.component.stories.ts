import { HttpClientModule } from '@angular/common/http';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { ExcelService } from '../../../../../../shared/services/excel.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { DialogComponent } from './dialog.component';

const initialState = {
  company: {
    details: {
      ruc: '20524801117',
      name: 'PRUEBA DASHBOARD',
      entry: '11',
      entryName: 'Nombre de rubro 1',
      email: 'angelirivera1226@gmail.com',
      movilNumber: '931123502',
      movilOperator: 'B',
      newName: 'PRUEBA DASHBOARD',
      newNameGTPStatus: 1,
      status: 'Atendido',
      inReview: false,
      requestDate: '2023-03-16T16:48:07.6533333',
      documentType: 'DNI',
      documentNumber: '43111232',
      isNewFlow: true,
      collectionRestriction: '0',
      amountLimits: [
        {
          currency: '001',
          amountMax: 4000,
        },
        {
          currency: '002',
          amountMax: 4000,
        },
      ],
    },
    currencyLimits: [
      {
        label: 'Soles',
        symbol: 'S/',
        iso: 'PEN',
        locale: 'es-PE',
        code: '001',
        limitMax: 4000,
      },
      {
        label: 'Dólares',
        symbol: '$',
        iso: 'USD',
        locale: 'en-US',
        code: '002',
        limitMax: 4000,
      },
    ],
    useAmountLimits: true,
  },
  appConfig: {
    loaded: false,
    disabledAffiliation: false,
    showedCommission: false,
    showLoader: false,
    loadingRequest: false,
  },
  entityCache: {},
};

const meta: Meta<DialogComponent> = {
  title: 'Internal/Module/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedModule, HttpClientModule],
      providers: [
        Store,
        provideMockStore({ initialState }),
        ExcelService,
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<DialogComponent>;
export const Normal: Story = {};
export const Upload: Story = {
  args: {
    ready: true,
  },
};
