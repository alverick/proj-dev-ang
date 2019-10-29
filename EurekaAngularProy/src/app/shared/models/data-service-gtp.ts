export interface DataServiceGTP {
    id: number;
    name: string; 
    debtorCode: string;
    dataType: string;
    paymentType: string;
    idAccount:  number;
    accountNumber:string; 
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
    currencySymbol:string;
    inReview:  boolean;
    newNameCode:  boolean;
    newName: boolean;
    status: string;
    
/*
       id?: number; //1
    name: string; //1 
    nameCod?: string; //1
    tipoDato: string; //1
    tipoPago?: string; //1
    idCuenta: number; //1
    nroCuenta: string; //1 
    moneda: string; //1 
    usaWebApp: boolean; //1
    usaAgente: boolean; //1
    usaTienda: boolean; //1
    pagoPartes?:string;
    cobraMora: string; //1
    periodoMora: string; //1
    tipoMora: string; //1 
    monto?: number; //1  
    porcentaje?: number; //1
    simboloMoneda?: string; 
    inReview?: boolean; 
    NewNameCod:boolean;
    NewName:boolean;
    Status:string; */
}
 