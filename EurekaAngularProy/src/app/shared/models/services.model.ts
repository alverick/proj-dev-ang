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

export interface IServiceRemoteModel {
  accountNumber?: string;
  amount?: string | number | null;
  chargeInterest?: string;
  chargeType?: string | number | null;
  currency?: string;
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
  percentage?: string | number | null;
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
}

export interface IServicePostData {
  clientId?: number;
  deleted: any[];
  services: Array<Partial<IServiceRemoteModel>>;
}
