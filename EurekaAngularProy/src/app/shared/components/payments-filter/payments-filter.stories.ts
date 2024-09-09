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
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { type DateList } from '../../models/dateList';
import { type WayPay } from '../../models/way-pay';
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

const meta: Meta<PaymentsFilterComponent> = {
  title: 'Shared/Molecules/Payments Filter',
  component: PaymentsFilterComponent,
  decorators: [
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
  ],
  argTypes: { sendForm: { action: 'clicked' } },
};

export default meta;

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

const services = [
  {
    id: 456,
    res: '1106101',
    name: 'Paquete basico',
    debtorCode: 'DNI',
    dataType: 'S',
    paymentType: 'C',
    idAccount: '1007005770843',
    accountNumber: '*********0843 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 455,
    res: '1106103',
    name: 'Paquete familiar',
    debtorCode: 'Codigo Interno',
    dataType: 'P',
    paymentType: 'C',
    idAccount: '1007005770843',
    accountNumber: '*********0843 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 452,
    res: '1106102',
    name: 'Paquete turistico 1',
    debtorCode: 'Cliente 1',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '1007005770843',
    accountNumber: '*********0843 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'S',
    chargeType: 2,
    interestType: 'M',
    amount: 1000.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 453,
    res: '1106104',
    name: 'Paquete Turistico 2',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'P',
    idAccount: '1007000009666',
    accountNumber: '*********9666 (Dólares)',
    currency: '002',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'P',
    amount: null,
    percentage: 0.05,
    currencySymbol: '$',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 454,
    res: '1106105',
    name: 'Paquete turistico 4',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '1007005770843',
    accountNumber: '*********0843 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'P',
    amount: null,
    percentage: 0.5,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
];

const initial = {
  ...initialOrig,
  payment: initialOrig.payment.code,
};
console.log('initial', initial);

type Story = StoryObj<PaymentsFilterComponent>;

export const Normal: Story = {
  args: {
    stateList: listStates,
    dateList: listDates,
    gtpMode: false,
    services,
    initial,
  },
};

export const Gtp: Story = {
  args: {
    stateList: listStates,
    gtpMode: true,
  },
};
