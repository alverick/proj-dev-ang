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
