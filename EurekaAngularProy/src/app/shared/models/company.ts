interface IServicesUpdate {
  idAccount: string;
  debtorCode: string;
  newNameGTPStatus: number;
  chargeType: number;
  interestType: string;
  useAgent: boolean;
  newNameCode: string;
  partialPayment: string;
  paymentType: string;
  newNameCodeGTPStatus: number;
  useAppWeb: boolean;
  percentage: null;
  currency: string;
  id: number;
  useAgencyChannel: boolean;
  res: null;
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
  status: string;
}

export interface ICompanyUpdate {
  ruc: string;
  inReview: boolean;
  arrayServices: IServicesUpdate[];
  newNameGTPStatus: number;
  movilOperator: string;
  entry: string;
  newName: string;
  name: string;
  requestDate: string;
  id: number;
  useAgencyChannel: boolean;
  uniqueCodeIBK: string;
  movilNumber: string;
  email: string;
  status: string;
}

interface IServiceSendUpdate {
  NewName: string;
  NewCodName: null;
  ServiceId: number;
}

export interface ICompanySendUpdate {
  ArrayServices: IServiceSendUpdate[];
  Token: string;
  NewName: null | string;
}

export interface IAccountStateDetails {
  accountStateDetailsResponse: {
    requestdate: string;
    aprobationDate: string;
    lastAcces: string;
  };
}
