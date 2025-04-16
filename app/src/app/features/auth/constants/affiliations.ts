import { swalAlert } from '../../../shared/utils/helpers/popups';

export const swalMesssageExit = swalAlert.mixin({
  title: 'Registro en proceso',
  text: `El registro de tu empresa no ha concluido, si sales ahora perderás los datos ingresados.`,
  showConfirmButton: true,
  confirmButtonText: 'Aceptar',
});
