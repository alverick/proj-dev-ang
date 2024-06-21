import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { DashboardFilterComponent } from './dashboard-filter.component';

const serviceList = [
  {
    id: 2284,
    res: '1600304',
    name: 'datos de prueba',
    debtorCode: 'DNI',
    dataType: 'S',
    paymentType: 'C',
    idAccount: '0222',
    accountNumber: '*********0222 (Soles)',
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
    newName: 'datos de prueba mod',
    newNameGTPStatus: 3,
    status: 'Activo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2297,
    res: '1600305',
    name: 'prueba',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '0222',
    accountNumber: '*********0222 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'M',
    amount: 2.0,
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
    id: 1633,
    res: '1600301',
    name: 'SERVICIO1',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'P',
    idAccount: '0222',
    accountNumber: '*********0222 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'M',
    amount: 5.0,
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
    id: 1634,
    res: '1600303',
    name: 'SERVICIO2',
    debtorCode: 'CODIGO INTERNO',
    dataType: 'P',
    paymentType: 'C',
    idAccount: '',
    accountNumber: '',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: true,
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
    status: 'Inactivo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 1635,
    res: '1600302',
    name: 'SERVICIO3',
    debtorCode: 'RUC',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '',
    accountNumber: '',
    currency: '002',
    useAppWeb: true,
    useAgent: true,
    useStore: true,
    partialPayment: 'N',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: '$',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: 'Inactivo',
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
];

const meta: Meta<DashboardFilterComponent> = {
  title: 'Internal/Dashboard/Dashboard Filter',
  component: DashboardFilterComponent,
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

export default meta;

const services = serviceList.map(
  ({ currency, currencySymbol, id, name, dataType }) => ({
    id,
    name,
    currency,
    currencySymbol,
    dataType,
  })
);
const optionsDates = [
  { name: 'Pago', code: 'payment' },
  { name: 'Emisión', code: 'emission' },
  { name: 'Vencimiento', code: 'due' },
];

const dateTo = new Date().toDateString();
const dateFrom = new Date();
dateFrom.setMonth(dateFrom.getMonth() - 1);

type Story = StoryObj<DashboardFilterComponent>;

export const Normal: Story = {
  args: {
    services,
    optionsDates,
    initialValue: {
      services,
      payment: optionsDates[0].code,
      dateFrom: dateFrom.toDateString(),
      dateTo,
    },
  },
};
