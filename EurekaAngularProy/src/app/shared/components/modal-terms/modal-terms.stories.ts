import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { ModalTermsComponent } from './modal-terms.component';

@Component({
  template: ` <button pButton pRipple (click)="launch()">Launch</button>`,
})
class LaunchComponent {
  constructor(private dialog: MatDialog) {}

  public launch(): void {
    this.dialog.open(ModalTermsComponent, {
      width: '810px',
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
      providers: [],
    }),
  ],
  argTypes: { sendForm: { action: 'clicked' } },
} as Meta;

const Template: Story<LaunchComponent> = (args: LaunchComponent) => ({
  props: args,
});

export const Normal = Template.bind({});
Normal.args = {};
