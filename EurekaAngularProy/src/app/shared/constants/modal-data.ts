import { type DynamicDialogConfig } from 'primeng/dynamicdialog';

export const headerModalTerms = 'Términos y condiciones';
export const modalTermsConfig: DynamicDialogConfig = {
  width: '810px',
  footer: ' ',
  height: '500px',
  header: headerModalTerms,
  styleClass: 'modal-custom-cs',
  maximizable: true,
};

export const affiliationModalTitleError = 'Regístrame';

export const affiliationModalTitleNotAvailable = 'Afiliación no disponible';
export const affiliationModalMessageNotAvailable =
  'No puedes afiliarte en este momento porque aún no se ha completado la validación de poderes de tu empresa o no eres el representante legal. Por favor, verifica tu información y vuelve a intentarlo una vez que se haya finalizado este proceso.';
