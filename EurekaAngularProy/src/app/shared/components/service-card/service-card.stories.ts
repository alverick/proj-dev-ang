import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { type ServiceCardComponent } from './service-card.component';

const meta: Meta<ServiceCardComponent> = {
  title: 'Shared/Molecules/Service card',
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

type Story = StoryObj<ServiceCardComponent>;

export const normal: Story = {
  args: {
    serviceData: {
      id: 2560,
      res: '1405805',
      name: 'DCP-SIN MORA',
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
      amount: 1,
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
    canEdit: true,
    lockedMode: true,
    position: 0,
    reviewMode: false,
  },
};

export const pendant: Story = {
  args: {
    serviceData: {
      id: 2428,
      res: '1405801',
      name: 'CelularMovistar',
      debtorCode: 'ticket',
      dataType: 'C',
      paymentType: 'P',
      idAccount: '1332',
      accountNumber: '*********1332 (Soles)',
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
      inReview: true,
      newNameCode: '',
      newNameCodeGTPStatus: 2,
      newName: '',
      newNameGTPStatus: 1,
      status: 'Activo',
      debtorCodeType: 0,
      useAgencyChannel: false,
    },
    canEdit: false,
    lockedMode: true,
    position: 0,
    reviewMode: false,
  },
};

export const userReview: Story = {
  args: {
    serviceData: {
      id: 2428,
      res: '1405801',
      name: 'CelularMovistar',
      debtorCode: 'ticket',
      dataType: 'C',
      paymentType: 'P',
      idAccount: '1332',
      accountNumber: '*********1332 (Soles)',
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
      inReview: true,
      newNameCode: '',
      newNameCodeGTPStatus: 3,
      newName: '',
      newNameGTPStatus: 1,
      status: 'Activo',
      debtorCodeType: 0,
      useAgencyChannel: false,
    },
    canEdit: true,
    lockedMode: true,
    position: 0,
    reviewMode: false,
  },
};

export const registration: Story = {
  args: {
    canEdit: true,
    lockedMode: false,
    position: 0,
    reviewMode: false,
    serviceData: {
      id: null,
      name: 'wwqwe',
      newName: 'wwqwe',
      dataType: 'S',
      paymentType: 'C',
      idAccount: '8180',
      accountNumber: '*********8180 (Soles)',
      currency: '001',
      useAppWeb: true,
      useAgent: false,
      useStore: false,
      chargeInterest: 'N',
      partialPayment: 'N',
      debtorCode: 'DNI',
      newNameCode: 'DNI',
      chargeType: '',
      interestType: 'M',
      amount: '1.00',
      percentage: '1.00',
    },
  },
};

export const update: Story = {
  args: {
    canEdit: true,
    lockedMode: false,
    position: 0,
    reviewMode: true,
    serviceData: {
      id: 2091,
      res: null,
      name: 'DeudaRC',
      debtorCode: 'asd654da65sd4a6s5d4a',
      dataType: 'P',
      paymentType: 'C',
      idAccount: '5884',
      accountNumber: '*********5884 (Soles)',
      currency: '001',
      useAppWeb: true,
      useAgent: true,
      useStore: false,
      partialPayment: 'N',
      chargeInterest: 'N',
      chargeType: 1,
      interestType: 'M',
      amount: 1,
      percentage: null,
      currencySymbol: 'S/',
      inReview: true,
      newNameCode: '',
      newNameCodeGTPStatus: 1,
      newName: 'DeudaRC',
      newNameGTPStatus: 3,
      status: 'EnRevision',
      debtorCodeType: 0,
      useAgencyChannel: false,
      nameOriginal: 'DeudaRC',
      debtorCodeOriginal: 'asd654da65sd4a6s5d4a',
    },
  },
};
