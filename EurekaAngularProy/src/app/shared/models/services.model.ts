export interface ServiceModel {
    servicio: string;
    rubro: number;
    codDeudor: number;
    tipoDato: string;
    tipoPago: number;
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