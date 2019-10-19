import { RequestTypegtp } from './request-typegtp';
export interface EnterprisesGtp {
      ClientId: number ;
      RequestDate?: Date; 
      Ruc: string;
      Cu: String;
      NameEnterprises:String;
      requestType: RequestTypegtp[];
      Status:  string; 
}
