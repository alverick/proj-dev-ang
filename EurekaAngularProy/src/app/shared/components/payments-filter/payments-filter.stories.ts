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
import { withActions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';

import { DateList } from '../../models/dateList';
import { WayPay } from '../../models/way-pay';
import { SharedModule } from '../../shared.module';
import { PaymentsFilterComponent } from './payments-filter.component';

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
  title: 'Shared/Molecules/Payments Filter',
  component: PaymentsFilterComponent,
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

const listStates: WayPay[] = [
  { idWayPay: 'da', descripcion: 'Domiciliaciones' },
];

const listDates: DateList[] = [
  { idDate: 'EmissionDate', descripcion: 'Emisión' },
  { idDate: 'DueDate', descripcion: 'Vencimiento' },
  { idDate: 'PaymentDate', descripcion: 'Pago' },
];

const initialOrig = {
  payment: {
    name: 'Pago',
    code: 'PaymentDate',
  },
  dateTo: '2023-03-08T10:08:25.379Z',
  dateFrom: '2023-02-08T10:08:25.379Z',
  services: [
    {
      id: 456,
      name: 'Paquete basico',
      currency: '001',
      dataType: 'S',
    },
    {
      id: 455,
      name: 'Paquete familiar',
      currency: '001',
      dataType: 'P',
    },
    {
      id: 452,
      name: 'Paquete turistico 1',
      currency: '001',
      dataType: 'C',
    },
    {
      id: 453,
      name: 'Paquete Turistico 2',
      currency: '002',
      dataType: 'C',
    },
    {
      id: 454,
      name: 'Paquete turistico 4',
      currency: '001',
      dataType: 'C',
    },
  ],
};
const initial = {
  ...initialOrig,
  payment: initialOrig.payment.code,
};
console.log('initial', initial);

export const normal = () => ({
  component: PaymentsFilterComponent,
  props: {
    stateList: listStates,
    dateList: listDates,
    gtpMode: boolean('GTP Mode', false),
    initial,
  },
  argTypes: { sendForm: { action: 'clicked' } },
});

export const gtp = () => ({
  component: PaymentsFilterComponent,
  props: {
    stateList: listStates,
    gtpMode: boolean('GTP Mode', true),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
