import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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

export default {
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
  argTypes: { sendForm: { action: 'clicked' } },
} as Meta;

const Template: Story<LaunchComponent> = (args: LaunchComponent) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {};
