import { HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { service } from '../../../../../../shared/mocks/service';
import { initialState } from '../../../../../../shared/mocks/store';
import { TrackingService } from '../../../../../../shared/services';
import { ExcelService } from '../../../../../../shared/services/excel.service';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { DialogComponent } from './dialog.component';

const meta: Meta<DialogComponent> = {
  title: 'Internal/Module/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedModule, HttpClientModule],
      providers: [
        DynamicDialogRef,
        Store,
        provideMockStore({ initialState }),
        { provide: ExcelService, useValue: { service, statusUpload: true } },
        StorageService,
        TrackingService,
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
    progress: {
      status: 'Subiendo',
      mode: 'determinate',
      value: 50,
    },
  },
};
