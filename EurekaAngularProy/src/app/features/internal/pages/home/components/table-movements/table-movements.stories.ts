import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import {
  DateAdapter,
  MatIconRegistry,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../../../../../../../environments/environment';
import { SharedModule } from '../../../../../../shared/shared.module';
import { TableMovementsComponent } from './table-movements.component';

function initAppComponentFactory(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
) {
  return async () => {
    matIconRegistry.addSvgIcon(
      'eurc_calendar',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/calendar.svg'
      ),
      { viewBox: '0 0 24 24' }
    );
  };
}

export default {
  title: 'Internal/Home/Movements Table',
  component: TableMovementsComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
      ],
      providers: [
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
      ],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  component: TableMovementsComponent,
  props: {
    gtpMode: boolean('GTP Mode', false),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
