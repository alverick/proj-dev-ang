export interface ISelectOptions {
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
  { value: 'CE', label: 'Carnet de extranjería' },
  { value: 'PASS', label: 'Pasaporte' },
];

export const companyDocumentStorageName = 'ddmk';
