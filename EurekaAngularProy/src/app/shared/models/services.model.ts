export interface IServiceModel {
  res?: string;
  id?: number;
  nombre: string;
  newName?: string;
  newNameCode?: string;
  rubro?: number;
  codDeudor?: string;
  nameCod?: string;
  debtorCode?: string;
  tipoDato: string;
  tipoPago?: string;
  nroCuenta: string;
  idCuenta: string;
  moneda: string;
  simboloMoneda?: string;
  usaWebApp: boolean;
  usaAgente: boolean;
  usaTienda: boolean;
  cobraMora: string;
  periodoMora: string;
  tipoMora: string;
  monto?: number | string;
  porcentaje?: number | string;
  inReview?: boolean;
  pagoPartes?: string;
  NewNameCod?: boolean;
  NewName?: boolean;
  status?: string;
  nombreHabilitado?: boolean;
  nombreCodHabilitado?: boolean;
  acceptednewName?: boolean;
  acceptednewNameCode?: boolean;
  newNameGtpStatus?: number;
  newNameCodeGtpStatus?: number;
  useAgencyChannel?: boolean;
}

type QuantityType = string | number | null;

export interface IServiceRemoteModel {
  accountNumber?: string;
  amount?: QuantityType;
  chargeInterest?: string;
  chargeType?: QuantityType;
  currency: string;
  currencySymbol?: string;
  dataType: string;
  debtorCode: string;
  debtorCodeType?: number;
  entry?: number;
  id?: number | null;
  idAccount: string;
  inReview?: boolean;
  interestType?: string;
  name: string;
  newName?: string;
  newNameCode?: string;
  newNameCodeGTPStatus?: number;
  newNameGTPStatus?: number;
  partialPayment?: string;
  paymentType: string;
  percentage?: QuantityType;
  res?: string;
  status?: string;
  useAgencyChannel?: boolean;
  useAgent?: boolean;
  useAppWeb?: boolean;
  useStore?: boolean;
  debt?: IServiceRemoteModel;
}

export interface IServiceRemoteModelForms extends IServiceRemoteModel {
  debtorCodeCustom: string;
  nameOriginal: string;
  debtorCodeOriginal: string;
}

export interface ServicePostData {
  clientId?: number;
  deleted: any[];
  services: Partial<IServiceRemoteModel>[];
}
