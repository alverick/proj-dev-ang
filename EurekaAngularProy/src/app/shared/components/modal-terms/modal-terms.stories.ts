import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { type DynamicDialogRef } from 'primeng/dynamicdialog';

import { modalTermsConfig } from '../../constants/modal-data';
import { TrackingService } from '../../services';
import { DynamicDialogService } from '../../services/dynamic-dialog.service';
import { StorageService } from '../../services/storage.service';
import { SharedModule } from '../../shared.module';
import { ModalTermsComponent } from './modal-terms.component';

@Component({
  template: ` <button pButton pRipple (click)="launch()">Launch</button>`,
  standalone: true,
})
class LaunchComponent {
  ref: DynamicDialogRef;

  constructor(public dialogService: DynamicDialogService) {}

  public launch(): void {
    this.ref = this.dialogService.open(ModalTermsComponent, modalTermsConfig);
  }
}

const meta: Meta<LaunchComponent> = {
  title: 'UI/Modal terms',
  component: LaunchComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
      providers: [DynamicDialogService, StorageService, TrackingService],
    }),
  ],
};

export default meta;

type Story = StoryObj<LaunchComponent>;

export const Normal: Story = {
  args: {},
};
