export interface DataEnterpriseModel {

    ruc: number|string;
    name: string;
    entry: string;
    email: string;
    movilNumber: number;
    movilOperator: string;
    newName: string;
    newNameGTPStatus?: number;
    status: String;
    requestDate?: Date;
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    inReview?: boolean  ;
}
