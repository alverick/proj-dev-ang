import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { http, HttpResponse } from 'msw';

import { environment } from '../../../../../environments/environment';
import { companyAccounts } from '../../../../shared/mocks/company';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ServicesGTPComponent } from './services-gtp.component';

const meta: Meta<ServicesGTPComponent> = {
  title: 'Admin/UI/Services GTP',
  component: ServicesGTPComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
      providers: [AfiliacionService],
    }),
  ],
};

export default meta;

const serviceNormal = {
  id: 656,
  res: '1702302',
  name: 'Deuda DC',
  newName: '',
  newNameCode: '',
  debtorCode: 'DNI',
  dataType: 'C',
  paymentType: 'C',
  idAccount: '3416',
  accountNumber: '*********3416 (Soles)',
  currency: '001',
  useAppWeb: true,
  useAgent: true,
  useStore: false,
  partialPayment: 'S',
  chargeInterest: 'S',
  chargeType: 1,
  interestType: 'M',
  amount: 3,
  porcentage: null,
  currencySymbol: 'S/',
  inReview: false,
  status: 'Activo',
  acceptednewNameCode: null,
  acceptednewName: null,
  nombreHabilitado: true,
  nombreCodHabilitado: true,
  newNameGTPStatus: 1,
  newNameCodeGTPStatus: 1,
  nombre: 'Deuda DC',
  codDeudor: 'DNI',
  tipoDato: 'C',
  tipoPago: 'C',
  nroCuenta: '*********3416 (Soles)',
  moneda: '001',
  simboloMoneda: 'S/',
  usaWebApp: true,
  usaAgente: true,
  usaTienda: false,
  cobraMora: 'S',
  periodoMora: '1',
  tipoMora: 'M',
  monto: 4,
  porcentaje: null,
  pagoPartes: 'S',
  useAgencyChannel: false,
};

type Story = StoryObj<ServicesGTPComponent>;

const serviceInReview = {
  id: 657,
  res: '',
  name: null,
  newName: 'Deuda DCAKSDEV',
  newNameCode: 'DNI',
  debtorCode: null,
  dataType: 'C',
  paymentType: 'C',
  idAccount: '3416',
  accountNumber: '*********3416 (Soles)',
  currency: '001',
  useAppWeb: true,
  useAgent: true,
  useStore: false,
  partialPayment: 'S',
  chargeInterest: 'N',
  chargeType: 1,
  interestType: 'M',
  amount: 1,
  porcentage: null,
  currencySymbol: 'S/',
  inReview: true,
  status: 'EnRevision',
  acceptednewNameCode: null,
  acceptednewName: null,
  nombreHabilitado: true,
  nombreCodHabilitado: true,
  newNameGTPStatus: 0,
  newNameCodeGTPStatus: 0,
  nombre: null,
  codDeudor: null,
  tipoDato: 'C',
  tipoPago: 'C',
  nroCuenta: '*********3416 (Soles)',
  moneda: '001',
  simboloMoneda: 'S/',
  usaWebApp: true,
  usaAgente: true,
  usaTienda: false,
  cobraMora: 'N',
  periodoMora: '1',
  tipoMora: 'M',
  monto: 1,
  porcentaje: null,
  pagoPartes: 'S',
  useAgencyChannel: false,
};
export const Normal: Story = {
  args: {
    service: serviceNormal,
    cuentas: companyAccounts,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${environment.END_POINT}/company/cards`, () => {
          return HttpResponse.json(companyAccounts);
        }),
      ],
    },
  },
};
export const Review: Story = {
  args: {
    service: serviceInReview,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://apis.dev.interbank.pe/eureca/api/company/cards',
          () => {
            return HttpResponse.json(companyAccounts);
          },
        ),
      ],
    },
  },
};
