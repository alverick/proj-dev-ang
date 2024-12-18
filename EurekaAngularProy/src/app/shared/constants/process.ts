export const processStatus = {
  confirmUser: 'CONFIRM_USER',
  created: 'CREATED',
  validating: 'VALIDATING',
  validated: 'VALIDATED',
  saving: 'SAVING',
  rejected: 'REJECTED',
  failed: 'FAILED',
  completed: 'COMPLETED',
} as const;

export type StatusValuesKeys = keyof typeof processStatus;
export type StatusValues = (typeof processStatus)[StatusValuesKeys];
