export const messageModes = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
} as const;
export type MessageModeType = (typeof messageModes)[keyof typeof messageModes];
export type MessageColor = Record<
  MessageModeType,
  { bg: string; icon: string; iconColor: string }
>;
