import { DataServiceGTP } from "./data-service-gtp";

export interface DataEnterpriseGTP {
    cu?: string;
    ruc: string|number;
    name: string;
    entry: string;
    email: string;
    movilNumber: number;
    newName: string;
    newNameGTPStatus?: number;
    status: string;
    uniqueCodeIBK: String;
    requestDate?: Date;
    inReview?: boolean;
    arrayServices?: DataServiceGTP[];
    NombreApproved?: boolean;
    enabled?: boolean;
}
