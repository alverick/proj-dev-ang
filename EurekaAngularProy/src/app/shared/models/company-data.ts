import { type DataServiceGTP } from './data-service-gtp';

export interface ICompanyData {
  cu?: string;
  ruc: string | number;
  name: string;
  entry: string;
  entryName: string;
  email: string;
  movilNumber: number;
  movilOperator: string;
  newName: string;
  newNameGTPStatus?: any;
  status: string;
  uniqueCodeIBK: string;
  requestDate?: Date;
  inReview?: boolean;
  arrayServices?: DataServiceGTP[];
  NombreApproved?: boolean;
  enabled?: boolean;
  isNewEnterprise?: boolean;
  useAgencyChannel?: boolean;
}
