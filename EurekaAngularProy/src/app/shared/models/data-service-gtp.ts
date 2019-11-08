export interface DataServiceGTP {
    id: number;
    name: string;
    debtorCode: string;
    dataType: string;
    paymentType: string;
    idAccount:  number;
    accountNumber: string;
    currency:  string;
    usaWebApp: boolean;
    usaAgente: boolean;
    usaTienda: boolean;
    partialPayment: string;
    chargeInterest: string;
    chargeType: number;
    interestType: string;
    amount:  number;
    porcentage: number;
    currencySymbol: string;
    inReview:  boolean;
    newNameCode:  string;
    newName: string;
    status: string;
    acceptednewNameCode?: boolean;
    acceptednewName?: boolean;
}
