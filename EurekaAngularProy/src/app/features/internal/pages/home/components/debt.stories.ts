import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, importProvidersFrom, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { service } from '../../../../../shared/mocks/service';
import { initialState } from '../../../../../shared/mocks/store';
import { TrackingService } from '../../../../../shared/services';
import { DynamicDialogService } from '../../../../../shared/services/dynamic-dialog.service';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { HomeService } from '../../../../../shared/services/home.service';
import { StorageService } from '../../../../../shared/services/storage.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { DebtComponent } from './debt.component';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';

@Component({
  selector: 'cs-launch-debt',
  template: ` <button pButton pRipple (click)="launch()">Launch</button>`,
  standalone: true,
})
class LaunchComponent {
  ref: DynamicDialogRef;
  @Input() width = '650px';

  constructor(public dialogService: DynamicDialogService) {}

  public launch(): void {
    this.ref = this.dialogService.open(DebtComponent, {
      width: this.width,
      footer: ' ',
      header: 'Agrega cobros del servicio Servicio usuario nuevo',
      styleClass: 'modal-custom-cs modal-thin',
      style: { 'max-height': 'none' },
      dismissableMask: true,
      focusOnShow: false,
      focusTrap: false,
      templates: {
        header: DialogHeaderComponent,
      },
    });

    this.ref.onClose.subscribe((result) => {
      console.log(result);
    });
  }
}

const meta: Meta<DebtComponent> = {
  title: 'Internal/Home/Debt',
  component: DebtComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        Store,
        provideMockStore({ initialState }),
        HomeService,
        { provide: ExcelService, useValue: { service } },
        TrackingService,
        StorageService,
        DynamicDialogService,
        DynamicDialogRef,
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<DebtComponent>;

export const Normal: Story = {};

export const Partial: Story = {
  args: {
    isPartial: true,
  },
};

export const Modal: Story = {
  decorators: [
    moduleMetadata({
      imports: [LaunchComponent],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<cs-launch-debt/>`,
  }),
};
