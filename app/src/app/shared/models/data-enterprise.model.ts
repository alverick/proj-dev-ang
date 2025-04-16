export const collectionRestrictionTypes = {
  notRestricted: '0',
  restricted: '1',
} as const;

export type CollectionRestrictionTypes =
  (typeof collectionRestrictionTypes)[keyof typeof collectionRestrictionTypes];

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
  collectionRestriction: CollectionRestrictionTypes;
  requestDate?: Date | string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  inReview?: boolean;
  acceptTerms?: boolean;
  amountLimits: AmountLimit[];
}
