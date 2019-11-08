export interface DataEnterpriseModel {

    ruc: number;
    name: string;
    entry: string;
    email: string;
    movilNumber: number;
    newName: string;
    status: String;
    requestDate?: Date;
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    inReview: boolean  ;
}
