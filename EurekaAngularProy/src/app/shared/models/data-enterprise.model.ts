export interface AmountLimit {
  amountMax: number;
  currency: string;
}

export interface IDataEnterpriseModel {
  ruc: string;
  name: string;
  entry: string;
  entryName: string;
  email: string;
  movilNumber: string;
  movilOperator: string;
  documentType?: string;
  documentNumber?: string;
  newName?: string;
  newNameGTPStatus?: number;
  isNewFlow: boolean;
  status?: string;
  collectionRestriction: string;
  requestDate?: Date | string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  inReview?: boolean;
  acceptTerms?: boolean;
  amountLimits: AmountLimit[];
}
