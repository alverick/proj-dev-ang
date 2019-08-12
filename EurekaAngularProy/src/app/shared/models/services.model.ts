export interface ServiceModel {
    id?: number;
    nombre: string;
    rubro?: number;
    codDeudor?: string;
    nameCod?: string;
    tipoDato: string;
    tipoPago?: string;
    nroCuenta: string;
    moneda: string;
    simboloMoneda?: string;
    usaWebApp: boolean;
    usaAgente: boolean;
    usaTienda: boolean;      
    cobraMora: string;
    periodoMora?: number;
    tipoMora: string;
    monto?: number;
    porcentaje?: number;
}