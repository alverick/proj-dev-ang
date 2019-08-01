export interface ServiceModel {
    servicio: string;
    rubro: number;
    codDeudor: number;
    tipoDato: string;
    nroCuenta: string;
    moneda: string;
    usaWebApp: boolean;
    usaAgente: boolean;
    usaTienda: boolean;      
    cobraMora: string;
    periodoMora: number;
    tipoMora: string;
    monto: number;
    porcentaje: number;
}