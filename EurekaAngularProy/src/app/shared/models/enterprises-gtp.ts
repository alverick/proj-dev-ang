import { RequestTypegtp } from './request-typegtp';
export interface EnterprisesGtp {
      clientId: number ;
      requestDate: Date; 
      ruc: string;
      cu: String;  
      nameEnterprise:String;
      status:  string; 
      businessHeading:String;
      requesType:string;
      requestTypeList: RequestTypegtp[];
     
}
export interface EnterprisesPagedList { 
      listCompanyGTP: EnterprisesGtp[];
      totalCompanies: number;
  }
