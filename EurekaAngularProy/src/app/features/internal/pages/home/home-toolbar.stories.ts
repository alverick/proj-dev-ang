import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  type Meta,
  moduleMetadata,
  type StoryObj,
} from '@storybook/angular';
import { type MenuItem } from 'primeng/api';

import { SharedModule } from '../../../../shared/shared.module';

interface Services {
  idAccount: string;
  debtorCode: null | string;
  newNameGTPStatus: number;
  chargeType: number;
  interestType: string;
  useAgent: boolean;
  newNameCode: string;
  partialPayment: string;
  paymentType: string;
  newNameCodeGTPStatus: number;
  useAppWeb: boolean;
  percentage: null | number;
  currency: string;
  id: number;
  useAgencyChannel: boolean;
  res: string;
  inReview: boolean;
  amount: number;
  dataType: string;
  currencySymbol: string;
  accountNumber: string;
  useStore: boolean;
  chargeInterest: string;
  newName: string;
  name: string;
  debtorCodeType: number;
  status: null;
}

interface ToolbarButtons {
  items: MenuItem[];
}

const serviceList: Services[] = [
  {
    id: 3041,
    res: '',
    name: '',
    debtorCode: null,
    dataType: 'P',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: true,
    newNameCode: 'RUC',
    newNameCodeGTPStatus: 0,
    newName: 'SERVICIO DATA PARCIAL PRUEBA',
    newNameGTPStatus: 0,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 3042,
    res: '',
    name: '',
    debtorCode: null,
    dataType: 'C',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: true,
    newNameCode: 'Codigo Interno',
    newNameCodeGTPStatus: 0,
    newName: 'SERVICIO DATA COMPLETA SIN MORA PRUEBA',
    newNameGTPStatus: 0,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 3010,
    res: '1107417',
    name: 'DATA COMPLETA CON MORA PRUEBA',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'P',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'P',
    amount: null,
    percentage: 0.01,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 3012,
    res: '1107419',
    name: 'DATA COMPLETA SIN MORA PRUEBA',
    debtorCode: 'Codigo Interno',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'N',
    chargeType: 1,
    interestType: 'M',
    amount: 1.0,
    percentage: null,
    currencySymbol: 'S/',
    inReview: true,
    newNameCode: 'DNI',
    newNameCodeGTPStatus: 2,
    newName: '',
    newNameGTPStatus: 1,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2775,
    res: '1107410',
    name: 'DeudaMoraPorcent',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'P',
    amount: null,
    percentage: 5.0,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2899,
    res: '1107411',
    name: 'PRUEBA ESTADO Serv',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
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
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2639,
    res: '1107404',
    name: 'sdc',
    debtorCode: 'DNI',
    dataType: 'P',
    paymentType: 'C',
    idAccount: '6558',
    accountNumber: '*********6558 (Soles)',
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
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2640,
    res: '1107405',
    name: 'sdc',
    debtorCode: 'RUC',
    dataType: 'C',
    paymentType: 'C',
    idAccount: '6558',
    accountNumber: '*********6558 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
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
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2678,
    res: '1107406',
    name: 'SDCT Serv002',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'P',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: false,
    useStore: false,
    partialPayment: 'S',
    chargeInterest: 'S',
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
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 2985,
    res: '1107416',
    name: 'SERVICIO JOB PRUEBA 2',
    debtorCode: 'DNI',
    dataType: 'P',
    paymentType: 'C',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
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
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
  {
    id: 3021,
    res: '1107418',
    name: 'SERVICIO PRUEBA 18',
    debtorCode: 'DNI',
    dataType: 'C',
    paymentType: 'P',
    idAccount: '3796',
    accountNumber: '*********3796 (Soles)',
    currency: '001',
    useAppWeb: true,
    useAgent: true,
    useStore: false,
    partialPayment: 'N',
    chargeInterest: 'S',
    chargeType: 1,
    interestType: 'P',
    amount: null,
    percentage: 0.05,
    currencySymbol: 'S/',
    inReview: false,
    newNameCode: '',
    newNameCodeGTPStatus: 1,
    newName: '',
    newNameGTPStatus: 1,
    status: null,
    debtorCodeType: 0,
    useAgencyChannel: false,
  },
];

const itemsDropdown = serviceList.map<MenuItem>((item) => ({
  label: `<span class="name">${item.name}</span><span class="type">${
    item.dataType === 'C' ? 'Data completa' : 'Data parcial'
  }</span>`,
  styleClass: 'menu-item-categories',
  escape: false,
  command: () => {
    console.log(item);
  },
}));

const meta: Meta<ToolbarButtons> = {
  title: 'UI/Toolbar Home',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, SharedModule],
    }),
  ],
  argTypes: {
    items: { defaultValue: serviceList },
  },
};

export default meta;
type Story = StoryObj<ToolbarButtons>;

export const Default: Story = {
  args: {
    items: itemsDropdown,
  },
  render: (args) => ({
    props: args,
    template: `<section
              class="tw-flex tw-border-b tw-border-extended-grey-4 tw-flex-col-reverse sm:tw-flex-row sm:tw-items-center tw-justify-between tw-gap-4 tw-px-4 tw-pb-4"
            >
              <div class="rows-actions tw-flex">
                <button
                  pButton
                  pRipple
                  type="button"
                  icon="pi pi-trash"
                  label="Eliminar"
                  class="p-button-text p-button-sm p-button-outlined tw-h-11"
                ></button>
              </div>
              <div
                class="movements-actions tw-h-full tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-text-primary-green-1 tw-text-sm tw-gap-6"
              >
                <div class="tw-flex">
                  <button
                    pButton
                    pRipple
                    type="button"
                    icon="pi pi-download"
                    label="Descargar movimientos"
                    class="p-button-text p-button-sm p-button-outlined tw-h-11"
                  ></button>
                </div>
                <div class="tw-flex">
                  <p-splitButton
                  #ua
                    label="Agregar cobros"
                    icon="pi pi-plus"
                    [model]="items"
                    styleClass="p-button-outlined p-button-sm p-button-success"
                    (onClick)="ua.onDropdownButtonClick($event)"
                  ></p-splitButton>
                </div>
              </div>
            </section>`,
  }),
};
