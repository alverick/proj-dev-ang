import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import {
  DateAdapter,
  MatDialogRef,
  MatIconRegistry,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
} from '@angular/material';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PaymentDetailComponent } from './payment-detail.component';

function initAppComponentFactory(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
) {
  return async () => {
    matIconRegistry.addSvgIcon(
      'eurc_trash',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/trash.svg'),
      { viewBox: '0 0 24 24' }
    );
  };
}

export default {
  title: 'Internal/Home/Payment Detail',
  component: PaymentDetailComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        CookieService,
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [MatIconRegistry, DomSanitizer],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            customer: {
              code: 93837373,
              name: 'werwerwe',
            },
            currency: 'S/',
            debtId: 288287,
            status: 'PARCIAL',
          },
        },
      ],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  component: PaymentDetailComponent,
  props: {
    gtpMode: boolean('GTP Mode', false),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});

export const gtp = () => ({
  component: PaymentDetailComponent,
  props: {
    gtpMode: boolean('GTP Mode', true),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
