export type CompanyChangePasswordForm = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

export interface CompanyForm {
  ruc: string;
  name: string;
  entry: string;
  entryName: string;
  email: string;
  movilNumber: string;
  movilOperator: string;
  documentType: string;
  documentNumber: string;
}
