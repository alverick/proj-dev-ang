import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { LoggerModule } from 'ngx-logger';
import { isNil } from 'ramda';

import { environment } from '../../../../../../../environments/environment';
import { movementsDataMock } from '../../../../../../shared/mocks/home';
import { initialState } from '../../../../../../shared/mocks/store';
import { TrackingService } from '../../../../../../shared/services';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SelectAllTableService } from '../../../../services';
import { TableMovementsComponent } from './table-movements.component';

export default {
  title: 'Internal/Home/Movements Table',
  component: TableMovementsComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom([BrowserAnimationsModule])],
    }),
    moduleMetadata({
      declarations: [],
      imports: [
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
        SelectAllTableService,
        TrackingService,
        StorageService,
        Store,
        provideMockStore({ initialState }),
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
