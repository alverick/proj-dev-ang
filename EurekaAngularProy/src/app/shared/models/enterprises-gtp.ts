import { RequestTypegtp } from './request-typegtp';
export interface EnterprisesGtp {
  clientId: number;
  requestDate: Date;
  ruc: string;
  cu: string;
  nameEnterprise: string;
  status: string;
  businessHeading: string;
  requesType: string;
  requestTypeList: RequestTypegtp[];
}
export interface EnterprisesPagedList {
  listCompanyGTP: EnterprisesGtp[];
  totalCompanies: number;
}
