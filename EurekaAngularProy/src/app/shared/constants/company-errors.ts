import { IErrorMessages } from '../models/forms';

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
export const errorRegisterAuth: IErrorMessages = {
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
    length: 'La contraseña no es válida',
    minlength: 'La contraseña no es válida',
    sequence: 'La contraseña no es válida',
    symbol: 'La contraseña no es válida',
  },
  oldPassword: {
    required: 'La contraseña es obligatoria',
    minlength: 'La contraseña debe tener mínimo 6 dígitos',
    pattern: 'La contraseña debe tener por lo menos una letra',
    noLetter: 'La contraseña debe tener por lo menos una letra',
    noNumber: 'La contraseña debe tener por lo menos un número',
    notEqual: 'La contraseña debe ser distinta a la actual',
  },
  newPassword: {
    required: 'La contraseña es obligatoria',
    length: 'La contraseña no es válida',
    minlength: 'La contraseña no es válida',
    sequence: 'La contraseña no es válida',
    symbol: 'La contraseña no es válida',
    notEqual: 'La contraseña debe ser distinta a la actual',
  },
  passwordConfirm: {
    required: 'Debes repetir la contraseña',
    mustMatch: 'Debe ser igual a la contraseña',
    length: 'La contraseña no es válida',
    minlength: 'La contraseña no es válida',
    sequence: 'La contraseña no es válida',
    symbol: 'La contraseña no es válida',
  },
  acceptTerms: {
    required: 'Acepte los términos y condiciones',
  },
};
export const errorServiceInformation: IErrorMessages = {
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
  debtorCode: {
    change: 'Ingresa otro código deudor',
  },
  debtorCodeCustom: {
    change: 'Ingresa otro código deudor',
  },
  account: {
    required: 'Elige una opción',
  },
};
export const errorServiceConfiguration: IErrorMessages = {
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
