import { IErrorMessages } from '../../../shared/models/forms';
import { swalAlert } from '../../../shared/utils/helpers/popups';

interface ISelectOptions {
  symbol?: string;
  value: string;
  label: string;
}

export const mobileOperators: ISelectOptions[] = [
  { value: 'M', label: 'Movistar' },
  { value: 'C', label: 'Claro' },
  { value: 'E', label: 'Entel' },
  { value: 'B', label: 'Bitel' },
];
export const documentTypes: ISelectOptions[] = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carnet de extranjeria' },
  { value: 'PASS', label: 'Pasaporte' },
];
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

export const errorsRegisterForm: IErrorMessages = {
  documentType: {
    required: 'Selecciona un tipo de documento',
  },
  documentNumber: {
    required: 'Número de documento es obligatorio',
    pattern: 'Ingresa un número de documento válido',
  },
  ruc: {
    required: 'El RUC es obligatorio',
    pattern: 'Ingresa un RUC válido',
    minlength: 'El RUC debe tener 11 dígitos',
  },
  email: {
    required: 'El correo electrónico es obligatorio',
    pattern: 'Ingresa un correo electrónico válido',
    minlength: 'El correo electrónico debe tener mínimo 10 dígitos',
  },
  emailConfirm: {
    required: 'Confirmar correo electrónico es obligatorio',
    mustMatch: 'El correo ingresado no coincide con el anterior',
  },
  movilNumber: {
    required: 'Celular es obligatorio',
    pattern: 'Ingrese un celular válido',
    minlength: 'Celular debe tener mínimo 9 dígitos',
  },
  movilOperator: {
    required: 'Selecciona un operador',
  },
};

export const errorMessagesAuth: IErrorMessages = {
  name: {
    required: 'El nombre comercial es obligatorio',
    blankSpaces: 'El nombre comercial es obligatorio',
    pattern: 'Ingrese un nombre valido',
    minlength: 'El nombre debe tener mínimo 3 dígitos',
    change: 'Escribe un nuevo nombre de la empresa',
  },
  entry: {
    required: 'Elige una opción',
  },
  entrySelect: {
    required: 'Elige una opción',
  },
  password: {
    required: 'La contraseña es obligatoria',
    minlength: 'La contraseña debe tener mínimo 6 dígitos',
    pattern: 'La contraseña debe tener por lo menos una letra',
  },
  passwordConfirm: {
    required: 'Debes repetir la contraseña',
    mustMatch: 'Debe ser igual a la contraseña',
    minlength: 'La contraseña debe tener mínimo 6 dígitos',
    pattern: 'La contraseña debe tener por lo menos una letra',
  },
  acceptTerms: {
    required: 'Acepte los términos y condiciones',
  },
};

export const errorMessagesService: IErrorMessages = {
  name: {
    required: 'Ingresa el concepto de cobro',
    blankSpaces: 'Ingresa el concepto de cobro',
    pattern: 'Ingrese un nombre correcto',
    minlength: 'El nombre no puede tener menos de 3 caracteres',
    maxlength: 'El nombre no puede tener mas de 80 caracteres',
    alfa: 'El nombre debe tener por lo menos una letra o un numero',
    alfabetico: 'El nombre debe tener por lo menos una letra',
    change: 'Ingresa otro nombre para el servicio',
  },
  account: {
    required: 'Elige una opción',
  },
};

export const errorMessagesServiceConfig: IErrorMessages = {
  amount: {
    required: 'Ingresa un monto',
  },
  dataType: {
    required: 'Elige una opción',
  },
  debtorCode: {
    required: 'Ingresa un código',
  },
  debtorCodeCustom: {
    required: 'Ingresa un código',
    blankSpaces: 'Ingresa un código',
  },
  paymentType: {
    required: 'Elige una opción',
  },
  partialPayment: {
    required: 'Elige una opción',
  },
  idCuenta: {
    required: 'Elige una opción',
  },
  chargeType: {
    required: 'Elige una opción',
  },
  interestType: {
    required: 'Elige una opción',
  },
};

export const swalMesssageExit = swalAlert.mixin({
  title: 'Registro en proceso',
  text: `El registro de tu empresa no ha concluido, si sales ahora perderás los datos ingresados.`,
  showConfirmButton: true,
  confirmButtonText: 'Aceptar',
});

export const debtorCodeCustomEmpty = 'empty__';
