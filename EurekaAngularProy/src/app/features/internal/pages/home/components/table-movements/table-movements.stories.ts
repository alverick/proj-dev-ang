import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { LoggerModule } from 'ngx-logger';
import { isNil } from 'ramda';

import { environment } from '../../../../../../../environments/environment';
import { movementsDataMock } from '../../../../../../shared/mocks/home';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SelectAllTableService } from '../../../../services';
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
        SelectAllTableService,
      ],
    }),
  ],
};

const data = movementsDataMock.map((item) => {
  return {
    ...item,
    emissionDate: isNil(item.emissionDate) ? '' : new Date(item.emissionDate),
    dueDate: isNil(item.dueDate) ? '' : new Date(item.dueDate),
    canEditFirstName: true,
    canEditEmissionDate: !isNil(item.emissionDate),
    canEditDueDate: !isNil(item.dueDate),
    canEditAmount: item.amount > 0,
  };
});

export const normal = () => {
  return {
    component: TableMovementsComponent,
    props: {
      data,
    },
    argTypes: { sendForm: { action: 'clicked' } },
  };
};
export const withoutData = () => ({
  component: TableMovementsComponent,
  props: {},
});
