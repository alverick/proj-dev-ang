export interface ServiceModel {
    id?: number;
    nombre: string;
    newName?: string;
    newNameCode?: string;
    rubro?: number;
    codDeudor?: string;
    nameCod?: string;
    tipoDato: string;
    tipoPago?: string;
    nroCuenta: string;
    idCuenta: number;
    moneda: string;
    simboloMoneda?: string;
    usaWebApp: boolean;
    usaAgente: boolean;
    usaTienda: boolean;
    cobraMora: string;
    periodoMora: string;
    tipoMora: string;
    monto?: number;
    porcentaje?: number;
    inReview?: boolean;
    pagoPartes?: string;
    NewNameCod?: boolean;
    NewName?: boolean;
    status?: string;
}
