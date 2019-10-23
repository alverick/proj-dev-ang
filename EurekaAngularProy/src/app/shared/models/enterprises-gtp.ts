import { RequestTypegtp } from './request-typegtp';
export interface EnterprisesGtp {
      ClientId: number ;
      RequestDate?: Date; 
      Ruc: string;
      Cu: String;  
      NameEnterprises:String;
      Status:  string; 
      BusinessHeading:String;
      requesType:string;
      requestTypeList: RequestTypegtp[];
     
}
export interface EnterprisesPagedList { 
      listCompanyGTP: EnterprisesGtp[];
      totalCompanies: number;
  }
