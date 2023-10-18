export interface IDataEnterpriseModel {
  ruc: string;
  name: string;
  entry: string;
  email: string;
  movilNumber: string;
  movilOperator: string;
  documentType?: string;
  documentNumber?: string;
  newName?: string;
  newNameGTPStatus?: number;
  status?: string;
  requestDate?: Date;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  inReview?: boolean;
  acceptTerms?: boolean;
}
