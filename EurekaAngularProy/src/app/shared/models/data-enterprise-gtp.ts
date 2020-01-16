import { DataServiceGTP } from "./data-service-gtp";

 export interface DataEnterpriseGTP {
    cu?: string;
    ruc: string|number;
    name: string;
    entry: string;
    entryName: string;
    email: string;
    movilNumber: number;
    movilOperator: string;
    newName: string;
    newNameGTPStatus?: any;
    status: string;
    uniqueCodeIBK: String;
    requestDate?: Date;
    inReview?: boolean;
    arrayServices?: DataServiceGTP[];
    NombreApproved?: boolean;
    enabled?: boolean;
}
