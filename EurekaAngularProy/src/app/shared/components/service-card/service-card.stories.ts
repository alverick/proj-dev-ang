import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { IServiceRemoteModel } from '../../models';
import { SharedModule } from '../../shared.module';

export default {
  title: 'Shared/Molecules/Service card',
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
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

export const normal = () => ({
  template: `<div class="tw-p-5"><cs-service-card class="tw-m-10" [serviceData]="serviceData" [canEdit]="canEdit"></cs-service-card></div>`,
  props: {
    serviceData: object('serviceData', {
      id: 1606,
      res: '1500202',
      name: 'Mensualidad',
      debtorCode: 'DNI',
      dataType: 'C',
      paymentType: 'C',
      idAccount: '8180',
      accountNumber: '*********8180 (Soles)',
      currency: '001',
      useAppWeb: true,
      useAgent: false,
      useStore: true,
      partialPayment: 'N',
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
    } as IServiceRemoteModel),
    canEdit: boolean('canEdit', true),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
