import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { applicationConfig } from '@storybook/angular';
import { LoggerModule } from 'ngx-logger';
import { isNil } from 'ramda';

import { environment } from '../../../../../../../environments/environment';
import { movementsDataMock } from '../../../../../../shared/mocks/home';
import { initialState } from '../../../../../../shared/mocks/store';
import { TrackingService } from '../../../../../../shared/services';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { SelectAllTableService } from '../../../../services';
import { TableMovementsComponent } from './table-movements.component';

export default {
  title: 'Internal/Home/Movements Table',
  component: TableMovementsComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(
          LoggerModule.forRoot({
            level: environment.logLevel,
            serverLogLevel: environment.serverLogLevel,
            disableConsoleLogging: false,
            enableSourceMaps: true,
          }),
        ),
        SelectAllTableService,
        TrackingService,
        StorageService,
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
