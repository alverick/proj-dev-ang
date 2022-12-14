import { ISelectOptions } from '../../../shared/constants/company';
import { swalAlert } from '../../../shared/utils/helpers/popups';

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

export const swalMesssageExit = swalAlert.mixin({
  title: 'Registro en proceso',
  text: `El registro de tu empresa no ha concluido, si sales ahora perderás los datos ingresados.`,
  showConfirmButton: true,
  confirmButtonText: 'Aceptar',
});

export const debtorCodeCustomEmpty = 'empty__';
