import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { Button } from 'primeng/button';

import { SharedModule } from '../../shared.module';
import { MessageAlertComponent } from './message-alert.component';

export default {
  title: 'UI/Message alert',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
};

export const DefaultStory = () => ({
  template: `<cs-message-alert class="tw-m-5" mode="info">Nombre con el que tus clientes te buscarán en los canales Interbank al
        momento de pagarte.</cs-message-alert>`,
  props: {
    text: 'Button with custom styles',
  },
  styles: [
    `
      cs-text-input {
        margin: 25px;
      }
    `,
  ],
});

DefaultStory.story = {
  name: 'Default',
};

export const normal = () => ({
  component: MessageAlertComponent,
  props: {
    gtpMode: false,
  },
  argTypes: { sendForm: { action: 'clicked' } },
});

export const ActionOnly = () => ({
  component: Button,
  props: {
    text: 'Action only',
    onClick: action('log 1'),
  },
});

ActionOnly.story = {
  name: 'Action only',
};

export const ActionAndMethod = () => ({
  component: Button,
  props: {
    text: 'Action and Method',
    onClick: (e) => {
      console.log(e);
      e.preventDefault();
      action('log2')(e.target);
    },
  },
});

ActionAndMethod.story = {
  name: 'Action and method',
};
