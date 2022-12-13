import { isEmpty, isNil } from 'ramda';
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
  debtorCodeCustom,
  debtorCode,
  amount,
  chargeType,
  interestType
) {
  const parsedDebtorCode =
    debtorCodeCustom === debtorCodeCustomEmpty ? debtorCode : debtorCodeCustom;

  const parseAmount = parseFloat(amount).toFixed(2);

  return {
    debtorCode: parsedDebtorCode,
    newNameCode: parsedDebtorCode,
    chargeType: isEmpty(chargeType) ? '' : parseInt(chargeType, 10),
    interestType: isNil(interestType) ? 'M' : interestType,
    amount: interestType === 'M' ? parseAmount : '1.00',
    percentage: interestType === 'P' ? parseAmount : '1.00',
  };
}
