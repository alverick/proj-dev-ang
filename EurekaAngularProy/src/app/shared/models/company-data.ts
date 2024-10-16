import { type DataServiceGTP } from './data-service-gtp';

export interface ICompanyData {
  cu?: string;
  ruc: string | number;
  name: string;
  entry: string;
  entryName: string;
  email: string;
  movilNumber: string | number;
  movilOperator: string;
  newName: string;
  newNameGTPStatus?: number;
  uniqueCodeIBK: string;
  requestDate?: Date | string;
  inReview?: boolean;
  arrayServices?: DataServiceGTP[];
  NombreApproved?: boolean;
  enabled?: boolean;
  isNewEnterprise?: boolean;
  useAgencyChannel?: boolean;
}
