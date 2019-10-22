import { RequestTypegtp } from './request-typegtp';
export interface EnterprisesGtp {
      ClientId: string ;
      RequestDate?: Date; 
      Ruc: string;
      Cu: String;
      BusinessHeading: String;
      NameEnterprises:String;
      requestType: RequestTypegtp[];
      Status:  string; 
}
