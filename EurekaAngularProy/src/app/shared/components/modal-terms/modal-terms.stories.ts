import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { type DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';

import { SharedModule } from '../../shared.module';
import { ModalTermsComponent } from './modal-terms.component';

@Component({
  template: ` <button pButton pRipple (click)="launch()">Launch</button>`,
})
class LaunchComponent {
  ref: DynamicDialogRef;

  constructor(public dialogService: DialogService) {}

  public launch(): void {
    this.ref = this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });
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
      providers: [DialogService],
    }),
  ],
};

export default meta;

type Story = StoryObj<LaunchComponent>;

export const Normal: Story = {
  args: {},
};
