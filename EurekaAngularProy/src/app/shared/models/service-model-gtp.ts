export interface ServiceModelGTP {
  id?: number;
  nombre: string;
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
  status: string;
  newNameCod: string;
  newName: string;
}
