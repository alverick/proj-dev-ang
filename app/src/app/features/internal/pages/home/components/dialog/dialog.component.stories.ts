import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { service } from '../../../../../../shared/mocks/service';
import { initialState } from '../../../../../../shared/mocks/store';
import type { IErrorObj } from '../../../../../../shared/models/error.model';
import { TrackingService } from '../../../../../../shared/services';
import { ExcelService } from '../../../../../../shared/services/excel.service';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';
import { DialogComponent } from './dialog.component';

const meta: Meta<DialogComponent> = {
  title: 'Internal/Module/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        DynamicDialogRef,
        Store,
        provideMockStore({ initialState }),
        { provide: ExcelService, useValue: { service } },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              width: '899px',
              styleClass: 'upload-files-dialog modal-custom-cs',
              templates: {
                header: DialogHeaderComponent,
              },
              maskStyleClass: 'upload-files-dialog',
              focusOnShow: false,
              header: 'Agrega cobros del servicio Servicio usuario nuevo',
              data: {
                amountLimits: [],
                useAmountLimits: false,
              },
            },
          },
        },
        StorageService,
        TrackingService,
      ],
    }),
  ],
};

export default meta;

const errors: IErrorObj[] = [
  {
    code: 1,
    row: 2,
    description:
      'El código deudor ingresado ya existe, el nombre existente se va a mantener',
    field: '',
    value: '',
  },
  {
    code: 1,
    row: 22,
    description: 'Monto debe tener un valor',
    field: '',
    value: '',
  },
];

type Story = StoryObj<DialogComponent>;
export const Normal: Story = {};
export const Upload: Story = {
  args: {
    ready: true,
    progress: {
      status: 'Subiendo',
      mode: 'determinate',
      value: 50,
    },
  },
};
export const Errors: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ExcelService,
          useValue: { service, statusUpload: false, errores: errors },
        },
      ],
    }),
  ],
  args: {
    ready: true,
    progress: {
      status: 'Subiendo',
      mode: 'determinate',
      value: 50,
    },
  },
};
