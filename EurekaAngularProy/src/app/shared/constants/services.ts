import { isEmpty, isNil } from 'ramda';
import { isNotNil, isString } from 'ramda-adjunct';
import { IServiceRemoteModel, IServiceRemoteModelForms } from '../models';
import { ISelectOptions } from './company';

export const debtorCodeOptions: ISelectOptions[] = [
  {
    value: 'DNI',
    label: 'DNI',
  },
  {
    value: 'RUC',
    label: 'RUC',
  },
  {
    value: 'Codigo Interno',
    label: 'Celular',
  },
  {
    value: 'Otro',
    label: 'Otro (Cód. Interno, Cod. Alumno, N° de departamentos, etc.)',
  },
];
export const paymentTypeOptions: ISelectOptions[] = [
  {
    value: 'C',
    label: 'Pueden elegir qué deuda quieren pagar',
  },
  {
    value: 'P',
    label: 'Siempre la deuda que vence primero',
  },
];
export const interestTypeOptions: ISelectOptions[] = [
  {
    value: 'M',
    label: 'Monto',
  },
  {
    value: 'P',
    label: 'Porcentaje',
  },
];
export const currencyOptions: ISelectOptions[] = [
  {
    value: '001',
    label: 'Soles',
    symbol: 'S/',
  },
  {
    value: '002',
    label: 'Dólares',
    symbol: '$',
  },
];
export const chargeTypeOptions: ISelectOptions[] = [
  {
    value: '1',
    label: 'Diario',
  },
  {
    value: '2',
    label: 'Fijo',
  },
];
export const dataTypeOptions: ISelectOptions[] = [
  {
    value: 'S',
    label: 'Sin data',
  },
  {
    value: 'P',
    label: 'Data parcial',
  },
  {
    value: 'C',
    label: 'Data completa',
  },
];
export const debtorCodeCustomEmpty = 'empty__';

export function parseParams(
  {
    debtorCodeCustom,
    debtorCode,
    amount = '1.00',
    chargeType,
    interestType,
  }: Partial<IServiceRemoteModelForms>,
  compareData: Partial<IServiceRemoteModel> = null
): Partial<IServiceRemoteModel> {
  let parsedNewNameCode;
  const parsedDebtorCode =
    debtorCodeCustom === debtorCodeCustomEmpty ? debtorCode : debtorCodeCustom;

  const amountNumber = isString(amount) ? parseFloat(amount) : amount;
  const parsedAmount = amountNumber.toFixed(2);

  let parsedChargeType: string | number;
  if (isEmpty(chargeType)) {
    parsedChargeType = '';
  } else {
    parsedChargeType = isString(chargeType)
      ? parseInt(chargeType, 10)
      : chargeType;
  }

  parsedNewNameCode =
    isNotNil(compareData) && parsedDebtorCode === compareData.debtorCode
      ? ''
      : parsedDebtorCode;
  return {
    debtorCode: parsedDebtorCode,
    newNameCode: parsedNewNameCode,
    chargeType: parsedChargeType,
    interestType: isNil(interestType) ? 'M' : interestType,
    amount: interestType === 'M' ? parsedAmount : '1.00',
    percentage: interestType === 'P' ? parsedAmount : '1.00',
  };
}

export const statusCodes = {
  NEW: 0,
  APPROVED: 1,
  EDITED: 2,
  REJECTED: 3,
};
