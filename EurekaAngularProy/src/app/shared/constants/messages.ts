export const messageModes = {
  info: 'info',
  warning: 'warning',
} as const;
export type MessageModeType = (typeof messageModes)[keyof typeof messageModes];
export type MessageColor = Record<
  MessageModeType,
  { bg: string; icon: string }
>;
