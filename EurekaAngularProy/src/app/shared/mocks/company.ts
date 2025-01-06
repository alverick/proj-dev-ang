import type { IDataEnterpriseModel } from '../models/data-enterprise.model';

export const getAffiliate: IDataEnterpriseModel = {
  ruc: '20524801117',
  name: 'PRUEBA DASHBOARD',
  entry: '11',
  entryName: 'Nombre de rubro 1',
  email: 'angelirivera1226@gmail.com',
  movilNumber: '931123502',
  movilOperator: 'B',
  newName: 'PRUEBA DASHBOARD',
  newNameGTPStatus: 1,
  status: 'Atendido',
  inReview: false,
  requestDate: '2023-03-16T16:48:07.6533333',
  documentType: 'DNI',
  documentNumber: '43111232',
  isNewFlow: true,
  collectionRestriction: '0',
  amountLimits: [
    { currency: '001', amountMax: 4000 },
    { currency: '002', amountMax: 4000 },
  ],
};
export const companyAccounts = [
  {
    id: '3416',
    number: '*********3416 ( CTA CTE PERSONA JURIDICA - Soles)',
    currency: '001',
  },
  {
    id: '3423',
    number: '*********3423 ( CTA CTE PERSONA JURIDICA - Dolares)',
    currency: '002',
  },
  {
    id: '1843',
    number: '*********1843 (AHORROS ME - Dolares)',
    currency: '002',
  },
];
