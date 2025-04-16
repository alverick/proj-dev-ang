import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { type ICompanyData } from '../../../../shared/models/company-data';
import { SharedModule } from '../../../../shared/shared.module';
import { EmpresaGTPComponent } from './empresa-gtp.component';

const meta: Meta<EmpresaGTPComponent> = {
  title: 'Admin/UI/Empresa GTP',
  component: EmpresaGTPComponent,
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

type Story = StoryObj<EmpresaGTPComponent>;
const enterpriseNormal: ICompanyData = {
  ruc: '20541628046',
  name: 'DISTRIBUIDORA ADV IMPORT EIRL',
  entry: '17',
  entryName: 'OTROS',
  email: 'correopruebaqa2@gmail.com',
  movilNumber: '976936892',
  movilOperator: 'C',
  newName: 'DISTRIBUIDORA ADV IMPORT EIRL',
  newNameGTPStatus: 1,
  uniqueCodeIBK: '00000060611124',
  requestDate: '2024-10-09T17:22:18.0033333',
  inReview: false,
  enabled: false,
  isNewEnterprise: false,
  useAgencyChannel: false,
};

const enterpriseReview: ICompanyData = {
  ruc: '20600600690',
  name: '',
  entry: '36',
  entryName: 'ENT ESTADO II',
  email: 'correopruebaqa2@outlook.es',
  movilNumber: '945580923',
  movilOperator: 'M',
  newName: 'AGREMAK PERU',
  newNameGTPStatus: 0,
  uniqueCodeIBK: '00000060090679',
  requestDate: '2024-06-21T16:56:50.5066667',
  inReview: true,
  enabled: false,
  isNewEnterprise: true,
  useAgencyChannel: false,
};

export const Normal: Story = {
  args: {
    enterprise: enterpriseNormal,
  },
};

export const Review: Story = {
  args: {
    enterprise: enterpriseReview,
  },
};
