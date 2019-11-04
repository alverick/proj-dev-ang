import { DataServiceGTP } from "./data-service-gtp";

export interface DataEnterpriseGTP {
    ruc: number;
    name: string;
    entry: string;
    email: string;
    movilNumber: number;
    newName: string;
    status: String;
    uniqueCodeIBK: String;
    requestDate?: Date;
    inReview?: boolean;
    arrayServices?: DataServiceGTP;
    NombreApproved?: boolean;
}
