import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { ModalTermsComponent } from './modal-terms.component';

export default {
  title: 'UI/Modal terms',
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const DefaultStory = () => ({
  component: ModalTermsComponent,
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
  component: ModalTermsComponent,
  props: {
    gtpMode: boolean('GTP Mode', false),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
