export const processStatus = {
  confirm_User: 'CONFIRM_USER',
  created: 'CREATED',
  validating: 'VALIDATING',
  validated: 'VALIDATED',
  saving: 'SAVING',
  rejected: 'REJECTED',
  failed: 'FAILED',
  completed: 'COMPLETED',
} as const;

export type StatusValues = Uppercase<keyof typeof processStatus>;
