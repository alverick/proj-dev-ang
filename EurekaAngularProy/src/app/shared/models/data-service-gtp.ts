export interface DataServiceGTP {
    id?: number; //1
    nombre: string; //1
    rubro?: number; //1
    codDeudor?: string; //1
    nameCod?: string; //1
    tipoDato: string; //1
    tipoPago?: string; //1
    nroCuenta: string; //1
    idCuenta: number; //1
    moneda: string; //1
    simboloMoneda?: string; //1
    usaWebApp: boolean; //1
    usaAgente: boolean; //1
    usaTienda: boolean; //1
    cobraMora: string; //1
    periodoMora: string; //1
    tipoMora: string; //1
    monto?: number; //1
    porcentaje?: number; //1
    inReview?: boolean;   //1
    pagoPartes?: string; //1
    Status:string;
    NewNameCod:boolean;
    NewName:boolean;
    //24
}
