export const processStatus = {
  created: 'CREATED',
  validating: 'VALIDATING',
  validated: 'VALIDATED',
  saving: 'SAVING',
  rejected: 'REJECTED',
  failed: 'FAILED',
  completed: 'COMPLETED',
} as const;

export type ProcessStatus = Uppercase<keyof typeof processStatus>;
