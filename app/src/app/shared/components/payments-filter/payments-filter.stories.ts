import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';

import { type DateList } from '../../models/dateList';
import type { StatesGtp } from '../../models/states-gtp';
import { PaymentsFilterComponent } from './payments-filter.component';

const meta: Meta<PaymentsFilterComponent> = {
  title: 'Shared/Molecules/Payments Filter',
  component: PaymentsFilterComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [],
      imports: [HttpClientModule],
    }),
  ],
};

export default meta;

const listStates: StatesGtp[] = [
  { idState: 'Pendiente', descripcion: 'Pendiente' },
  { idState: 'Atendido', descripcion: 'Atendido' },
  { idState: 'Devuelto a la empresa', descripcion: 'Devuelto a la Empresa' },
  { idState: 'Rechazado', descripcion: 'Rechazado' },
  { idState: 'Desafiliado', descripcion: 'Desafiliado' },
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
      code: '001',
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
    code: 1106,
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

const categories = [
  {
    code: '33',
    name: 'CLUBS CERT II',
  },
  {
    code: '34',
    name: 'COLEGIOS II',
  },
  {
    code: '36',
    name: 'ENT ESTADO II',
  },
  {
    code: '38',
    name: 'EVARIAS CSIII',
  },
  {
    code: '39',
    name: 'IB OPER.INTII',
  },
  {
    code: '40',
    name: 'INMOBILIAR II',
  },
  {
    code: '32',
    name: 'SEGURO/OTROII',
  },
  {
    code: '31',
    name: 'SERVICIOS II',
  },
  {
    code: '35',
    name: 'UNIV/INST II',
  },
  {
    code: '37',
    name: 'VARIOS II',
  },
];

const initial = {
  ...initialOrig,
  payment: initialOrig.payment.code,
};

type Story = StoryObj<PaymentsFilterComponent>;

export const Normal: Story = {
  args: {
    stateList: listStates,
    dateList: listDates,
    gtpMode: false,
    services,
  },
};

export const Gtp: Story = {
  args: {
    stateList: listStates,
    stateTypeList: [
      { idState: 'EmpNuevo', descripcion: 'Empresa Nueva' },
      { idState: 'EmpMod', descripcion: 'Actualización de Empresa' },
      { idState: 'SvcMod', descripcion: 'Actualización de Servicios' },
      { idState: 'SvcNuevo', descripcion: 'Nuevos Servicios' },
    ],
    gtpMode: true,
    services: categories,
    multipleState: true,
  },
};
